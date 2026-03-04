import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { Member } from '../member.entity';
import {
  FindAllMemberQueryDto,
  FindOnePetForAdminResDto,
} from '../dtos/find.admin.dto';
import { paginate, PaginationResult } from 'src/utils/pagination';
import { SubscriptionStatus } from 'src/modules/smollcare/enums/subscription-status.enum';
import { FindOneMemberResDto } from '../dtos/find.admin.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MemberAdminService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepo: Repository<Member>,
  ) { }

  async findAll(
    query: FindAllMemberQueryDto,
  ): Promise<PaginationResult<Member>> {
    const { search, ...pageQuery } = query;

    const searchQuery = search ? ILike(`%${search}%`) : undefined;

    const findOptions: FindManyOptions<Member> = {
      where: [
        { email: searchQuery },
        { name: searchQuery },
        { phone: searchQuery },
      ],
      order: {
        createdAt: 'DESC',
      },
    };

    return paginate(this.memberRepo, pageQuery, findOptions);
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

    return {
      ...member,
      pets: transformedPets,
      subscription: null,
    };
  }
}
