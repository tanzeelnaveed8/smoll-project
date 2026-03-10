import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeService } from './stripe.service';
import { StripeController } from './controllers/stripe.controller';
import { StripeWebhookController } from './controllers/stripe.webhook.controller';
import { MemberModule } from '../member/member.module';
import { SmollCareSubscription } from '../smollcare/entities/smoll-care-subscription.entity';
import { SmollCarePlan } from '../smollcare/entities/smoll-care-plan.entity';
import { PaymentLog } from '../payment-log/payment-log.entity';
import { Pet } from '../pet/entities/pet.entity';
import { Member } from '../member/member.entity';
import Stripe from 'stripe';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { PaymentLogModule } from '../payment-log/payment-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SmollCareSubscription,
      SmollCarePlan,
      PaymentLog,
      Pet,
      Member,
    ]),
    forwardRef(() => MemberModule),
    ConfigModule,
    PaymentLogModule,
  ],
  controllers: [
    StripeController,
    StripeWebhookController,
  ],
  providers: [
    StripeService,
    {
      provide: 'STRIPE_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Stripe(configService.get<string>('STRIPE_SECRET_KEY'), {
          apiVersion: '2022-11-15' as any,
        });
      },
    },
  ],
  exports: [StripeService],
})
export class StripeModule { }
