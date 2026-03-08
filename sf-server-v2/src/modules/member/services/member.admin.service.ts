import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { Member } from '../member.entity';
import {
  FindAllMemberQueryDto,
  FindAllMemberResDto,
  FindOnePetForAdminResDto,
} from '../dtos/find.admin.dto';
import { paginate, PaginationResult } from 'src/utils/pagination';
import { SubscriptionStatus } from 'src/modules/smollcare/enums/subscription-status.enum';
import { FindOneMemberResDto } from '../dtos/find.admin.dto';
import { Case } from 'src/modules/case/case.entity';

@Injectable()
export class MemberAdminService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepo: Repository<Member>,
    @InjectRepository(Case)
    private readonly caseRepo: Repository<Case>,
  ) { }

  async findAll(
    query: FindAllMemberQueryDto,
  ): Promise<PaginationResult<FindAllMemberResDto>> {
    const { search, ...pageQuery } = query;

    const searchQuery = search ? ILike(`%${search}%`) : undefined;

    const findOptions: FindManyOptions<Member> = {
      where: [
        { email: searchQuery },
        { name: searchQuery },
        { phone: searchQuery },
      ],
      relations: {
        pets: true,
        cases: true,
      },
      order: {
        createdAt: 'DESC',
      },
    };

    const result = await paginate(this.memberRepo, pageQuery, findOptions);

    const data: FindAllMemberResDto[] = result.data.map((member) => ({
      id: member.id,
      name: member.name,
      phone: member.phone,
      isPhoneVerified: member.isPhoneVerified,
      email: member.email,
      isEmailVerified: member.isEmailVerified,
      profileImg: member.profileImg,
      address: member.address,
      villa: member.villa,
      city: member.city,
      country: member.country,
      postalCode: member.postalCode,
      createdAt: member.createdAt,
      petsCount: member.pets?.length ?? 0,
      visitsCount: member.cases?.length ?? 0,
    }));

    return { ...result, data };
  }

  async findOne(id: string): Promise<FindOneMemberResDto> {
    const member = await this.memberRepo.findOne({
      where: { id },
      relations: {
        pets: {
          subscription: {
            benefitUsages: {
              partner: true,
            },
            plan: {
              benefits: true,
            },
          },
        },
      },
    });

    if (!member) {
      throw new NotFoundException(`Member with id "${id}" not found`);
    }

    const today = new Date();

    const transformedPets = member.pets.map((pet) => {
      let subscriptionDetails = null;
      let benefitUsageSummary = [];

      if (
        pet.subscription &&
        pet.subscription.endDate >= today &&
        pet.subscription.status !== SubscriptionStatus.REVOKED
      ) {
        subscriptionDetails = {
          status: pet.subscription.status,
          startDate: pet.subscription.startDate,
          endDate: pet.subscription.endDate,
        };

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
      }

      return {
        ...pet,
        subscriptionDetails,
        benefitUsageSummary,
      };
    });

    const visitsCount = await this.caseRepo.count({
      where: { member: { id: member.id } },
    });

    return {
      ...member,
      pets: transformedPets,
      subscription: null,
      petsCount: member.pets?.length ?? 0,
      visitsCount,
    };
  }

  async create(data: Partial<Member>): Promise<Member> {
    const member = this.memberRepo.create(data);
    return this.memberRepo.save(member);
  }

  async update(id: string, data: Partial<Member>): Promise<Member> {
    const member = await this.memberRepo.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException(`Member with id "${id}" not found`);
    }
    Object.assign(member, data);
    return this.memberRepo.save(member);
  }

  async remove(id: string): Promise<void> {
    const member = await this.memberRepo.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException(`Member with id "${id}" not found`);
    }
    await this.memberRepo.softRemove(member);
  }
}
