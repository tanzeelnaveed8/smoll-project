import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUser } from 'src/decorators/get-user.decorator';
import { PwdService } from '../../../modules/auth/services/pwd.service';
import { CaseStatusEnum } from 'src/modules/case/enums/case-status.enum';
import UpdateCometUserPayloadDto from 'src/modules/chat/dtos/update.dto';
import { SocketEventEnum } from 'src/modules/socket/socket-event.enum';
import { SocketService } from 'src/modules/socket/socket.service';
import dayJS from 'src/utils/dayjs';
import { paginate, PaginationResult } from 'src/utils/pagination';
import {
  Between,
  FindManyOptions,
  FindOptionsWhere,
  In,
  IsNull,
  Not,
  Repository,
} from 'typeorm';
import { CreateAvailabilityDto } from '../dtos/create.dto';
import {
  FindConsultationCalendarQueryDto,
  FindConsultationsForVetQueryDto,
  FindMemberForVetResDto,
  FindVetAvailabilityQueryDto,
} from '../dtos/find.dto';
import { UpdateVetPayloadDto } from '../dtos/update.dto';
import { VetAvailability } from '../entities/vet.availability.entity';
import { VetConsultation } from '../entities/vet.consultation.entity';
import { Vet } from '../entities/vet.entity';
import { ConsultationStatusEnum } from '../enums/consultation-status.enum';
import { ConsultationTypeEnum } from '../enums/consultation-type.enum';
import { VET_CALL_INITIATE_EVENT, VetCallInitiateEvent } from '../vet.event';
import { onlineConsultationReminderTemplate } from 'src/utils/emailTemplate';
import { NotificationService } from 'src/modules/notification/notification.service';
import { Member } from 'src/modules/member/member.entity';
import { Pet } from 'src/modules/pet/entities/pet.entity';
import { CreatePetPayloadDto } from 'src/modules/pet/dto/create.dto';
import { CreateCasePayloadDto, CreateCaseQueryDto } from 'src/modules/case/dto/create.dto';
import { Case } from 'src/modules/case/case.entity';
import { PetService } from 'src/modules/pet/services/pet.service';
import { SubscriptionStatus } from 'src/modules/smollcare/enums/subscription-status.enum';

@Injectable()
export class VetService {
  constructor(
    @InjectRepository(Vet)
    private readonly vetRepo: Repository<Vet>,
    @InjectRepository(VetAvailability)
    private readonly vetAvailabiltyRepo: Repository<VetAvailability>,
    @InjectRepository(VetConsultation)
    private readonly vetConsultationRepo: Repository<VetConsultation>,
    private readonly socketService: SocketService,
    private readonly eventEmitter: EventEmitter2,
    private readonly pwdService: PwdService,
    private readonly notificationService: NotificationService,
    @InjectRepository(Member)
    private readonly memberRepo: Repository<Member>,
    @InjectRepository(Pet)
    private readonly petRepo: Repository<Pet>,
    @InjectRepository(Case)
    private readonly caseRepo: Repository<Case>,
    private readonly petService: PetService,

  ) { }

  async findOne(id: string): Promise<Vet> {
    const vet = await this.vetRepo.findOne({
      where: { id },
      relations: {
        availabilities: true,
      },
    });

    if (!vet) {
      throw new NotFoundException(`Vet with "${id}" not found`);
    }

    return vet;
  }

  async findOneByEmail(email: string): Promise<Vet> {
    const vet = await this.vetRepo.findOne({
      where: { email, isSuspended: false },
    });

    return vet;
  }

  async findAll(): Promise<Vet[]> {
    return this.vetRepo.find({
      where: { isSuspended: false },
    });
  }

  async update(id: string, body: UpdateVetPayloadDto): Promise<Vet> {
    const vet = await this.findOne(id);
    const _body = { ...body };

    const cometUpdates: UpdateCometUserPayloadDto = {};

    if (body.name) {
      cometUpdates.name = body.name;
    }

    if (body.profileImg) {
      cometUpdates.avatar = body.profileImg.url;
    }

    // TOOD: move this logic in pwd service ( for partner as well )
    if (body.password) {
      const comparePassword = await this.pwdService.comparePwd(
        body.oldPassword,
        vet.password,
      );

      if (!comparePassword || !body.oldPassword) {
        throw new BadRequestException('Invalid password');
      }

      const hashedPassword = await this.pwdService.hashPwd(body.password);
      _body.password = hashedPassword;
    }

    if (typeof body.isOnline === 'boolean') {
      // Trigger a socket event to update the vet's online status
      this.socketService.emit(SocketEventEnum.VET_ONLINE_STATUS_CHANGE, {
        vetId: vet.id,
        isOnline: body.isOnline,
      });
    }

    return this.vetRepo.save({ ...vet, ..._body });
  }

  async findAvailabilities(
    vetId: string,
    query: FindVetAvailabilityQueryDto,
  ): Promise<VetAvailability[]> {
    const { date } = query;

    await this.findOne(vetId);

    const where: FindOptionsWhere<VetAvailability>[] = [];

    if (date) {
      const dayOfWeek = new Date(date)
        .toLocaleString('en-US', { weekday: 'short' })
        .toLowerCase();

      where.push(
        { vet: { id: vetId }, date },
        { vet: { id: vetId }, dayOfWeek },
      );
    } else {
      where.push({ vet: { id: vetId } });
    }

    return this.vetAvailabiltyRepo.find({
      where,
    });
  }

  async findOneMember(id: string): Promise<FindMemberForVetResDto> {
    const today = new Date();

    const member = await this.memberRepo.findOne({
      where: { id },
      relations: {
        pets: {
          subscription: {
            plan: {
              benefits: true,
            },
            benefitUsages: {
              partner: true,
            },
          },
        },
      },
    });

    if (!member) throw new BadRequestException('Member with associated id not found');

    const petsWithUsage = member.pets.map((pet) => {
      let benefitUsageSummary = [];
      let subscriptionDetails = null;

      if (
        pet.subscription &&
        pet.subscription.endDate >= today &&
        pet.subscription.status !== SubscriptionStatus.REVOKED
      ) {

        subscriptionDetails = pet.subscription
          ? {
            status: pet.subscription.status,
            startDate: pet.subscription.startDate,
            endDate: pet.subscription.endDate,
          }
          : null;

        const { plan, benefitUsages = [] } = pet.subscription;
        benefitUsageSummary = (plan?.benefits || []).map((benefit) => {
          const usageLogs = benefitUsages.filter(
            (log) => log.benefitId === benefit.id,
          );

          return {
            id: benefit.id,
            name: benefit.name,
            totalUsageCount: benefit.maxUsagePerSubscription,
            consumedUsageCount: usageLogs.length,
            history: usageLogs.map((log) => ({
              partnerId: log.partner?.id || null,
              clinicName: log.partner?.name || '',
              note: log.note,
              vet: log.vet,
              createdAt: log.createdAt,
            })),
          };
        });
      } else {
        pet.careId = null
      }

      return {
        ...pet,
        subscriptionDetails,
        benefitUsageSummary,
      };
    });

    return {
      ...member,
      pets: petsWithUsage,
    };
  }


  async createCase(
    memberId: string,
    query: CreateCaseQueryDto,
    body: CreateCasePayloadDto,
  ) {
    const { petId, vetId } = query;

    await this.petService.findOne(memberId, petId);
    await this.findOne(vetId);

    const _case = this.caseRepo.create({
      ...body,
      member: <any>{ id: memberId },
      pet: <any>{ id: petId },
      assignedVet: <any>{ id: vetId },
    });

    return this.caseRepo.save(_case);
  }

  async createPet(
    memberId: string,
    body: CreatePetPayloadDto
  ): Promise<Pet> {

    const member = await this.memberRepo.findOne({
      where: {
        id: memberId,
      }
    })

    if (!member) throw new BadRequestException('Member with associated id not found')

    const pet = this.petRepo.create({
      ...body,
      owner: { id: memberId }
    })

    return await this.petRepo.save(pet)
  }

  // NOTE: Only instant consultation is needed by client
  // TODO: We can refactor this service function later
  async findConsultations(
    user: AuthUser,
    query: FindConsultationsForVetQueryDto,
  ): Promise<PaginationResult<VetConsultation>> {
    const { type, isCompleted, ...pageQuery } = query;

    const where: FindOptionsWhere<VetConsultation> = {
      vet: { id: user.id },
      ...(isCompleted
        ? {}
        : {
            case: [
              { status: CaseStatusEnum.OPEN },
              { id: IsNull() },
            ],
          }),
    };

    switch (type) {
      case ConsultationTypeEnum.SCHEDULED:
        where.scheduledAt = Not(IsNull());
        where.status = ConsultationStatusEnum.SCHEDULED;
        break;
      case ConsultationTypeEnum.INSTANT:
        where.scheduledAt = IsNull();
        break;
    }

    if (isCompleted) {
      where.status = In([
        ConsultationStatusEnum.COMPLETED,
        ConsultationStatusEnum.INITIATED,
        ConsultationStatusEnum.REJECTED,
      ]);
    }

    const findOptions: FindManyOptions<VetConsultation> = {
      where,
      relations: {
        member: true,
        case: {
          pet: true,
        },
      },
      select: {
        id: true,
        member: {
          id: true,
          name: true,
        },
        scheduledAt: true,
        case: {
          description: true,
          pet: {
            name: true,
          },
        },
        createdAt: true,
        status: true,
        rejectedByVetName: true,
        acceptedAt: true,
      },
      order: {
        createdAt: 'DESC',
      },
    };

    return paginate(this.vetConsultationRepo, pageQuery, findOptions);
  }

  async findConsultationCalendar(
    vet: AuthUser,
    query: FindConsultationCalendarQueryDto,
  ): Promise<{
    consultations: VetConsultation[];
    lastDate: string | null;
  }> {
    const { startDate, type } = query;

    const start = dayJS(startDate);
    const end = type === 'monthly' ? start.add(30, 'day') : start.add(7, 'day');

    const consultations = await this.vetConsultationRepo.find({
      where: {
        vet: { id: vet.id },
        scheduledAt: Between(start.toDate(), end.toDate()),
      },
      relations: {
        member: true,
        case: true,
      },
      select: {
        id: true,
        scheduledAt: true,
        status: true,
        member: {
          id: true,
          name: true,
        },
        case: {
          id: true,
        },
      },
      order: {
        scheduledAt: 'ASC',
      },
    });

    const lastDate = end.toISOString();

    return {
      consultations,
      lastDate,
    };
  }

  async findOneConsultations(
    user: AuthUser,
    id: string,
  ): Promise<VetConsultation> {
    return this.vetConsultationRepo.findOne({
      where: {
        id,
        vet: {
          id: user.id,
        },
      },
      relations: {
        member: true,
        case: {
          pet: {
            healthHistory: true,
          },
        },
      },
    });
  }

  async initiateCall(vet: AuthUser, consultationId: string): Promise<void> {
    const consultation = await this.findOneConsultations(vet, consultationId);

    this.socketService.emit(SocketEventEnum.VET_CALL_INITIATE, {
      vetId: vet.id,
      consultationId: consultationId,
      caseId: consultation.case.id,
    });

    this.eventEmitter.emit(
      VET_CALL_INITIATE_EVENT,
      new VetCallInitiateEvent(consultation.member.id, vet.name),
    );
  }

  async initiateWithCallId(
    vet: AuthUser,
    memberId: string,
    callId: string,
  ): Promise<void> {
    this.socketService.emit(SocketEventEnum.VET_CALL_INITIATE_WITH_CALL_ID, {
      vetId: vet.id,
      memberId,
      callId,
    });
  }

  async closeConsultation(vet: AuthUser, id: string): Promise<VetConsultation> {
    const consultation = await this.findOneConsultations(vet, id);

    consultation.status = ConsultationStatusEnum.COMPLETED;
    await this.vetConsultationRepo.save(consultation);

    return consultation;
  }

  async acceptConsultation(vet: AuthUser, id: string): Promise<VetConsultation> {
    const consultation = await this.findOneConsultations(vet, id);
    if (consultation.status !== ConsultationStatusEnum.SCHEDULED) {
      throw new BadRequestException('Only scheduled consultations can be accepted');
    }
    consultation.acceptedAt = new Date();
    await this.vetConsultationRepo.save(consultation);
    return consultation;
  }

  async rejectConsultation(vet: AuthUser, id: string): Promise<VetConsultation> {
    const consultation = await this.findOneConsultations(vet, id);
    if (consultation.status !== ConsultationStatusEnum.SCHEDULED) {
      throw new BadRequestException('Only scheduled consultations can be rejected');
    }
    consultation.status = ConsultationStatusEnum.REJECTED;
    consultation.rejectedByVetName = vet.name;
    await this.vetConsultationRepo.save(consultation);
    return consultation;
  }

  async createAvailability(
    vetId: string,
    body: CreateAvailabilityDto,
  ): Promise<VetAvailability[]> {
    const { availability } = body;
    const vet = await this.findOne(vetId);

    if (!vet) {
      throw new NotFoundException(`Vet with id "${vetId}" not found`);
    }

    const availabilities: VetAvailability[] = [];

    for (const day of Object.keys(availability)) {
      const isDate = day.length > 5;
      const where = isDate
        ? { vet: { id: vetId }, date: new Date(day) }
        : { vet: { id: vetId }, dayOfWeek: day };

      // Validate intervals
      const validIntervals = availability[day].filter((interval) => {
        const start = new Date(`1970-01-01T${interval.from}Z`);
        const end = new Date(`1970-01-01T${interval.to}Z`);

        return start < end;
      });

      if (validIntervals.length !== availability[day].length) {
        throw new BadRequestException(`Invalid intervals provided for ${day}`);
      }

      const existingAvailability = await this.vetAvailabiltyRepo.findOne({
        where,
      });

      if (existingAvailability) {
        // Update existing availability
        existingAvailability.intervals = validIntervals;
        availabilities.push(existingAvailability);
      } else {
        // Create new availability
        availabilities.push(
          this.vetAvailabiltyRepo.create({
            vet: { id: vetId },
            dayOfWeek: isDate ? null : day,
            date: isDate ? new Date(day) : null,
            intervals: validIntervals,
          }),
        );
      }
    }

    return await this.vetAvailabiltyRepo.save(availabilities);
  }

  async sendReminder(vet: AuthUser, consultationId: string): Promise<void> {
    const consultation = await this.findOneConsultations(vet, consultationId);
    const member = consultation.member;

    try {
      this.notificationService.sendOneSignalNotification({
        heading: 'Reminder',
        message: `🔔 Reminder: You have an upcoming appointment with ${vet.name}.`,
        playerId: member.playerId,
        meta: {
          notificationType: 'vet-consultation-reminder',
          consultationId,
          petName: consultation.case.pet.name,
        },
      });
    } catch (error) {
      console.log('error', error);
    }

    try {
      this.notificationService.sendSmsNotification(
        member.phone,
        `🔔 Reminder: You have an upcoming appointment with ${vet.name}.`,
      );
    } catch (error) {
      console.log('error', error);
    }

    if (member.email) {
      try {
        this.notificationService.sendEmailNotification(
          member.email,
          'Smoll: You have an upcoming appointment',
          onlineConsultationReminderTemplate(
            member.name,
            vet.name,
            dayJS(consultation.scheduledAt).utc().format('MMM D, YYYY'),
            dayJS(consultation.scheduledAt).utc().format('h:mm A [UTC]'),
            vet.phone,
            member.email,
          ),
        );
      } catch (error) {
        console.log('error email', error);
      }
    }
  }

  async findFinanceStats(vetId: string): Promise<{
    totalVisits: number;
    completedVisits: number;
    totalEarnings: number;
  }> {
    const [totalVisits, completedVisits] = await Promise.all([
      this.vetConsultationRepo.count({
        where: { vet: { id: vetId } },
      }),
      this.vetConsultationRepo.count({
        where: {
          vet: { id: vetId },
          status: ConsultationStatusEnum.COMPLETED,
        },
      }),
    ]);
    return {
      totalVisits,
      completedVisits,
      totalEarnings: 0,
    };
  }
}
