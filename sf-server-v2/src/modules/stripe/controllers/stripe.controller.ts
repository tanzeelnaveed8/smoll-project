import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { StripeService } from '../stripe.service';
import {
  CreatePaymentSessionDto,
  CreatePaymentSessionResponseDto,
} from '../dtos/create.dto';
import { plainToInstance } from 'class-transformer';
import { ApiTags } from '@nestjs/swagger';
import { MemberService } from '../../member/services/member.service';

@ApiTags('Stripe')
@Controller('/member/stripe')
// @UseGuards(AuthGuard(), RoleGuard)
// @Roles([RolesEnum.MEMBER])
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly memberService: MemberService,
  ) {}

  @Post('create-payment-session')
  async createPaymentSession(
    @Body() body: CreatePaymentSessionDto,
  ): Promise<CreatePaymentSessionResponseDto> {
    const paymentSession = await this.stripeService.createPaymentSession(body);

    return plainToInstance(CreatePaymentSessionResponseDto, paymentSession);
  }

  @Get('setup-intent')
  async getSetupIntent(@Query('memberId') memberId: string) {
    const member = await this.memberService.findOne(memberId);

    if (!member?.stripeCustomerId) {
      throw new BadRequestException('Member must have Stripe customer ID.');
    }

    const setupIntent = await this.stripeService.createSetupIntent(
      member.stripeCustomerId,
    );
    return { clientSecret: setupIntent.client_secret };
  }
}
