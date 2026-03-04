import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResult, paginate } from 'src/utils/pagination';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { Case } from '../case.entity';
import { FindAllCasesAdminQueryDto } from '../dto/find.admin.dto';
import { SubscriptionStatus } from 'src/modules/smollcare/enums/subscription-status.enum';

@Injectable()
export class CaseAdminService {
  constructor(
    @InjectRepository(Case)
    private readonly caseRepo: Repository<Case>,
  ) {}

  async findAll(
    query: FindAllCasesAdminQueryDto,
  ): Promise<PaginationResult<Case>> {
    const { search, ...pageQuery } = query;

    const searchQuery = search ? { name: ILike(`%${search}%`) } : undefined;

    const findOptions: FindManyOptions<Case> = {
      relations: {
        member: true,
        pet: true,
        assignedVet: true,
      },
      where: [
        {
          pet: searchQuery,
        },
        {
          member: searchQuery,
        },
      ],
      select: {
        id: true,
        member: { name: true },
        pet: { name: true },
        createdAt: true,
        status: true,
      },
      order: {
        createdAt: 'DESC',
      },
    };

    return paginate(this.caseRepo, pageQuery, findOptions);
  }

  async findOne(id: string) {
    const _case = await this.caseRepo.findOne({
      where: {
        id,
      },
      relations: {
        member: true,
        pet: {
          subscription: {
            benefitUsages: {
              partner: true,
            },
            plan: {
              benefits: true,
            },
          },
        },
        assignedVet: true,
        partnerBooking: true,
        partnerCosts: true,
      },
    });

    if (!_case) {
      throw new NotFoundException(`Case with id ${id} not found`);
    }

    const pet = _case.pet;
    const today = new Date();

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
      ..._case,
      pet: {
        ...pet,
        subscriptionDetails,
        benefitUsageSummary,
      },
    };
  }
}
