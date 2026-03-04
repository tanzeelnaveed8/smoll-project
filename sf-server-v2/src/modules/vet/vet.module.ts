import { BullModule } from '@nestjs/bullmq';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Case } from '../case/case.entity';
import { CaseModule } from '../case/case.module';
import { ChatModule } from '../chat/chat.module';
import { Member } from '../member/member.entity';
import { OrganizationModule } from '../organization/organization.module';
import { Pet } from '../pet/entities/pet.entity';
import { PetService } from '../pet/services/pet.service';
import { SmollCareSubscription } from '../smollcare/entities/smoll-care-subscription.entity';
import { SmollCareModule } from '../smollcare/smoll-care.module';
import { SpecialityController } from './controllers/speciality.controller';
import { VetAdminController } from './controllers/vet.admin.controller';
import { VetController } from './controllers/vet.controller';
import { VetMemberController } from './controllers/vet.member.controller';
import { Speciality } from './entities/speciality.entity';
import { VetAvailability } from './entities/vet.availability.entity';
import { VetConsultation } from './entities/vet.consultation.entity';
import { Vet } from './entities/vet.entity';
import { VetFeedback } from './entities/vet.feedback.entity';
import { VetSpeciality } from './entities/vet.speciality.entity';
import { SpecialityService } from './services/speciality.service';
import { VetAdminService } from './services/vet.admin.service';
import { VetFeedbackService } from './services/vet.feedback.service';
import { VetMemberService } from './services/vet.member.service';
import { VetService } from './services/vet.service';
import { VetProcessor } from './vet.processor';
import { MemberModule } from '../member/member.module';
import { OrgCodeService } from '../member/services/member.org-code.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Vet,
      VetAvailability,
      VetConsultation,
      VetFeedback,
      Member,
      Pet,
      Case,
      SmollCareSubscription,
      Speciality,
      VetSpeciality,
    ]),
    ChatModule,
    CaseModule,
    forwardRef(() => MemberModule),
    BullModule.registerQueue({
      name: 'vet',
    }),
    SmollCareModule,
    OrganizationModule,
  ],
  controllers: [
    VetController,
    VetAdminController,
    VetMemberController,
    SpecialityController,
  ],
  providers: [
    VetService,
    VetAdminService,
    VetMemberService,
    VetFeedbackService,
    SpecialityService,
    VetProcessor,
    PetService,
    OrgCodeService,
  ],
  exports: [VetService, VetMemberService, VetAdminService],
})
export class VetModule {}
