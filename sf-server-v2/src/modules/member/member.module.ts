import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from '../chat/chat.module';
import { MemberController } from './controllers/member.controller';
import { Member } from '../member/member.entity';
import { MemberService } from './services/member.service';
import { MemberAdminController } from './controllers/member.admin.controller';
import { MemberAdminService } from './services/member.admin.service';
import { PartnerModule } from '../partner/partner.module';
import { StripeModule } from '../stripe/stripe.module';
import { VetConsultation } from '../vet/entities/vet.consultation.entity';
import { PartnerBooking } from '../partner/entities/partner.booking.entity';
import { VetModule } from '../vet/vet.module';
import { CaseModule } from '../case/case.module';
import { Case } from '../case/case.entity';
// OrganizationModule import removed – module not found
import { OrgCodeController } from './controllers/member.org-code.controller';
import { OrgCodeService } from './services/member.org-code.service';
import { OrganizationModule } from '../organization/organization.module';
import { MemberAiController } from './controllers/member.ai.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, VetConsultation, PartnerBooking, Case]),
    ChatModule,
    PartnerModule,
    forwardRef(() => StripeModule),
    forwardRef(() => VetModule),
    PartnerModule,
    VetModule,
    CaseModule,
    OrganizationModule,
  ],
  controllers: [MemberController, MemberAdminController, OrgCodeController, MemberAiController],
  providers: [MemberService, MemberAdminService, OrgCodeService],
  exports: [MemberService, TypeOrmModule],
})
export class MemberModule {}
