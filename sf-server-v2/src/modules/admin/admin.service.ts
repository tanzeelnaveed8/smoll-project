import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { Case } from '../case/case.entity';
import { Partner } from '../partner/entities/partner.entity';
import { Vet } from '../vet/entities/vet.entity';
import { Member } from '../member/member.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
    @InjectRepository(Case)
    private readonly caseRepo: Repository<Case>,
    @InjectRepository(Partner)
    private readonly partnerRepo: Repository<Partner>,
    @InjectRepository(Vet)
    private readonly vetRepo: Repository<Vet>,
    @InjectRepository(Member)
    private readonly memberRepo: Repository<Member>,
  ) {}

  findOneByEmail(email: string): Promise<Admin> {
    return this.adminRepo.findOne({ where: { email } });
  }

  async updatePassword(id: string, password: string): Promise<void> {
    await this.adminRepo.update({ id }, { password });
  }

  async findAnalytics() {
    const cases = await this.caseRepo.count();
    const partners = await this.partnerRepo.count();
    const vets = await this.vetRepo.count();
    const members = await this.memberRepo.count();

    return {
      cases,
      partners,
      vets,
      members,
    };
  }
}
