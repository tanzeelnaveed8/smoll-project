import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUser } from 'src/decorators/get-user.decorator';
import {
  FindManyOptions,
  FindOptionsRelations,
  FindOptionsWhere,
  ILike,
  Not,
  Repository,
} from 'typeorm';
import { PartnerService } from '../../partner/services/partner.service';
import { CaseStatusEnum } from '../enums/case-status.enum';
import { Case } from '../case.entity';
import {
  AddNotePayloadDto,
  AddExtraServicesPayloadDto,
  CloseCasePayloadDto,
  DirectEscalatePayloadDto,
  EscalatePayloadDto,
  MarkCustomerUnreachablePayloadDto,
  UpdateServiceChecklistPayloadDto,
} from '../dto/create.dto';
import {
  CASE_CLOSED_EVENT,
  CASE_EMERGENCY_ESCALATION_EVENT,
  CASE_ESCALATED_EVENT,
  CaseClosedEvent,
  CaseEmergencyEscalationEvent,
  CaseEscalatedEvent,
} from '../case.event';
import { FindAllCasesForVetQueryDto } from '../dto/find.vet.dto';
import { PaginationResult, paginate } from 'src/utils/pagination';
import { Partner } from 'src/modules/partner/entities/partner.entity';
import { NotificationService } from 'src/modules/notification/notification.service';
import { ConsultationStatusEnum } from 'src/modules/vet/enums/consultation-status.enum';
import { CasePartnerService } from './case.partner.service';
import { Logger } from 'src/configs/logger';
import { SocketEventEnum } from 'src/modules/socket/socket-event.enum';
import { SocketService } from 'src/modules/socket/socket.service';
import { RedisService } from 'src/modules/redis/redis.service';

@Injectable()
export class CaseVetService {
  private readonly logger = Logger.getInstance();

  constructor(
    @InjectRepository(Case)
    private readonly caseRepo: Repository<Case>,
    private readonly partnerService: PartnerService,
    private readonly event: EventEmitter2,
    private readonly notificationService: NotificationService,
    private readonly casePartnerService: CasePartnerService,
    private readonly socketService: SocketService,
    private readonly redisService: RedisService,
  ) {}

  async findAll(
    vet: AuthUser,
    query: FindAllCasesForVetQueryDto,
  ): Promise<PaginationResult<Case>> {
    const { search, ...pageQuery } = query;

    const searchQuery = search ? { name: ILike(`%${search}%`) } : undefined;
    const where: FindOptionsWhere<Case> = {
      assignedVet: { id: vet.id },
    };

    const findOptions: FindManyOptions<Case> = {
      relations: {
        member: true,
        pet: true,
      },
      where: [
        {
          ...where,
          id: ILike(`%${search}%`),
        },
        {
          ...where,
          description: ILike(`%${search}%`),
        },
        {
          ...where,
          vetNote: ILike(`%${search}%`),
        },
        {
          ...where,
          pet: searchQuery,
        },
        {
          ...where,
          member: searchQuery,
        },
        {
          ...where,
          member: {
            phone: ILike(`%${search}%`),
          },
        },
      ],
      select: {
        id: true,
        member: { name: true },
        pet: { name: true },
        createdAt: true,
        updatedAt: true,
        status: true,
        description: true,
      },
      order: {
        updatedAt: 'DESC',
      },
    };

    return paginate(this.caseRepo, pageQuery, findOptions);
  }

  async findOne(
    user: AuthUser,
    id: string,
    relations?: FindOptionsRelations<Case>,
  ) {
    const _case = await this.caseRepo.findOne({
      where: {
        id,
        assignedVet: { id: user.id },
      },
      relations: {
        member: true,
        pet: {
          healthHistory: true,
        },
        vetFeedback: true,
        partnerCosts: {
          partner: true,
        },
        partnerBooking: {
          partner: true,
        },
        ...relations,
      },
      select: {
        id: true,
        notes: true,
        serviceChecklist: true,
        customerReachabilityStatus: true,
        status: true,
        assets: true,
        vetNote: true,
        partnerCosts: {
          id: true,
          note: true,
          services: true,
          partner: {
            id: true,
            name: true,
            clinicImg: {
              url: true,
              filename: true,
              filesize: true,
              mimetype: true,
            },
          },
        },
        partnerBooking: {
          id: true,
          partner: { id: true },
          services: true,
        },
      },
    });

    if (!_case) {
      throw new NotFoundException(`Case with id ${id} not found`);
    }

    if (
      (!_case.serviceChecklist || !_case.serviceChecklist.length) &&
      _case.partnerBooking?.services?.length
    ) {
      _case.serviceChecklist = _case.partnerBooking.services.map((service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        price: Number(service.price ?? 0),
        checked: false,
        isExtra: false,
      }));
      await this.caseRepo.save(_case);
    }

    return _case;
  }

  async addNote(vet: AuthUser, id: string, body: AddNotePayloadDto) {
    const { notes } = body;

    this.logger.info(
      `[LOG: CASE_VET_SERVICE] Vet ${vet.id} adding note to case ${id}`,
    );

    const _case = await this.findOne(vet, id);

    if (_case.status !== CaseStatusEnum.OPEN) {
      this.logger.error(
        `[LOG: CASE_VET_SERVICE] Vet ${vet.id} tried to add note to case ${id} but case is not open`,
      );
      throw new BadRequestException('Note can only be added to open cases.');
    }

    _case.notes = notes;

    const updatedCase = await this.caseRepo.save(_case);

    this.logger.info(
      `[LOG: CASE_VET_SERVICE] Vet ${vet.id} added note to case ${id}`,
    );

    return updatedCase;
  }

  async closeCase(
    vet: AuthUser,
    id: string,
    body: CloseCasePayloadDto,
  ): Promise<Case> {
    const { note } = body;
    const _case = await this.findOne(vet, id, {
      vetConsultation: true,
    });

    if (_case.status === CaseStatusEnum.OPEN_ESCALATED) {
      throw new BadRequestException('Case is escalated at the moment');
    }

    const hasUncheckedServices =
      (_case.serviceChecklist ?? []).length > 0 &&
      _case.serviceChecklist.some((service) => !service.checked);

    if (hasUncheckedServices) {
      throw new BadRequestException(
        'Visit cannot be closed until all services are checked off.',
      );
    }

    _case.status = CaseStatusEnum.CLOSED;
    _case.vetNote = note;
    _case.vetConsultation.status = ConsultationStatusEnum.COMPLETED;

    // Notify user
    this.notificationService.sendOneSignalNotification({
      playerId: _case.member.playerId,
      heading: '🚨 Case Closed',
      message: `Your case for ${_case.pet.name} has been closed.`,
    });

    this.event.emit(
      CASE_CLOSED_EVENT,
      new CaseClosedEvent(vet.name, _case.member.id, _case.pet.name),
    );

    return this.caseRepo.save(_case);
  }

  async addExtraServices(
    vet: AuthUser,
    id: string,
    body: AddExtraServicesPayloadDto,
  ): Promise<Case> {
    const _case = await this.findOne(vet, id);

    const existing = _case.serviceChecklist ?? [];
    const extras = body.services.map((service, index) => ({
      id: `extra-${Date.now()}-${index}`,
      name: service.name,
      description: service.description ?? '',
      price: Number(service.price ?? 0),
      checked: false,
      isExtra: true,
    }));

    _case.serviceChecklist = [...existing, ...extras];
    return this.caseRepo.save(_case);
  }

  async updateServiceChecklist(
    vet: AuthUser,
    id: string,
    body: UpdateServiceChecklistPayloadDto,
  ): Promise<Case> {
    const _case = await this.findOne(vet, id);
    const checklist = _case.serviceChecklist ?? [];

    _case.serviceChecklist = checklist.map((service) =>
      service.id === body.serviceId
        ? {
            ...service,
            checked: body.checked,
          }
        : service,
    );

    return this.caseRepo.save(_case);
  }

  async markCustomerUnreachable(
    vet: AuthUser,
    id: string,
    body: MarkCustomerUnreachablePayloadDto,
  ): Promise<Case> {
    const _case = await this.findOne(vet, id);
    _case.customerReachabilityStatus = 'not_reachable';

    const notes = _case.notes ?? [];
    notes.push({
      content: body.reason ?? 'Customer is not reachable',
      createdAt: new Date().toISOString(),
    });
    _case.notes = notes;

    return this.caseRepo.save(_case);
  }

  async escalate(vet: AuthUser, id: string, body: EscalatePayloadDto) {
    const { vetNote, partnerIds } = body;

    const _case = await this.findOne(vet, id, {
      vetConsultation: true,
      member: true,
    });

    // Fetch only the specified partners
    const partners: Partner[] = [];

    for (const partnerId of partnerIds) {
      try {
        const partner = await this.partnerService.findOne(partnerId);
        partners.push(partner);
      } catch (error) {
        // Log the error or handle it as needed
      }
    }

    _case.status = CaseStatusEnum.OPEN_ESCALATED;
    _case.partners = partners;
    _case.vetNote = vetNote ?? '';

    if (_case.vetConsultation) {
      _case.vetConsultation.status = ConsultationStatusEnum.COMPLETED;
    }

    const updatedCase = await this.caseRepo.save(_case);

    // Notify user
    this.notificationService.sendOneSignalNotification({
      playerId: _case.member.playerId,
      heading: '🚨 Case Escalated',
      message: `Your case for ${_case.pet.name} has been escalated to our partners 👨‍⚕️👩‍⚕️`,
    });

    // Notify partners
    this.event.emit(
      CASE_ESCALATED_EVENT,
      new CaseEscalatedEvent(
        _case.member.id,
        partnerIds,
        vet.name,
        _case.pet.name,
      ),
    );

    return updatedCase;
  }

  async directEscalate(
    vet: AuthUser,
    id: string,
    body: DirectEscalatePayloadDto,
  ) {
    const {
      partnerId,
      services,
      vetNote,
      isEmergency,
      partnerVetId,
      scheduledAt,
    } = body;

    this.logger.info(
      `[LOG: CASE_VET_SERVICE] Directly escalating case ${id} to partner ${partnerId}`,
    );

    const _case = await this.findOne(vet, id, {
      vetConsultation: true,
      member: true,
      pet: true,
    });

    const partner = await this.partnerService.findOne(partnerId);

    _case.status = CaseStatusEnum.OPEN_ESCALATED;
    _case.partners = [partner];
    _case.vetNote = vetNote ?? '';
    _case.isDirectEscalated = true;
    _case.isEmergency = isEmergency ?? false;

    if (_case.vetConsultation) {
      _case.vetConsultation.status = ConsultationStatusEnum.COMPLETED;
    }

    const updatedCase = await this.caseRepo.save(_case);

    this.logger.info(
      `[LOG: CASE_VET_SERVICE] Creating quote for partner ${partner.id} ${
        isEmergency ? 'for emergency' : ''
      }`,
    );

    if (!isEmergency) {
      if (!partnerVetId || !scheduledAt) {
        this.logger.error(
          `[LOG: CASE_VET_SERVICE] Partner vet id and scheduled at are required for non-emergency direct escalation`,
        );

        throw new BadRequestException(
          'Partner vet id and scheduled at are required for non-emergency direct escalation',
        );
      }
    }

    await this.casePartnerService.createQuote(partner, id, {
      services,
      note: '',
      meta: !isEmergency
        ? {
            partnerVetId,
            scheduledAt,
          }
        : undefined,
    });

    try {
      if (isEmergency) {
        this.socketService.emit(SocketEventEnum.CTA_POPUP, {
          type: 'emergency',
          data: {
            caseId: _case.id,
            partnerId: partner.id,
            hasPartnerBooking: false,
            petName: _case.pet.name,
          },
        });

        this.redisService.setJson(
          `popup-emergency:${_case.member.id}`,
          {
            caseId: _case.id,
            partnerId: partner.id,
            hasPartnerBooking: false,
            petName: _case.pet.name,
          },
          60 * 60 * 60 * 42, // 2 days
        );
      }

      this.notificationService.sendOneSignalNotification({
        playerId: _case.member.playerId,
        heading: isEmergency
          ? '🚨 Case Emergency Transferred'
          : '🚨 Case Transferred',
        message: `Your ${isEmergency ? 'emergency' : ''} case for ${_case.pet.name} has been transferred to our partners 👨‍⚕️👩‍⚕️`,
        meta: {
          notificationType: 'quote-submitted',
          caseId: _case.id,
          partnerId: partner.id,
        },
      });

      this.event.emit(
        CASE_EMERGENCY_ESCALATION_EVENT,
        new CaseEmergencyEscalationEvent(
          partner.id,
          partner.name,
          _case.pet.name,
          isEmergency,
        ),
      );
    } catch (error) {
      this.logger.error(
        `[LOG: CASE_VET_SERVICE] Error sending notification to partner ${partner.id}`,
        error,
      );
    }

    return updatedCase;
  }
}
