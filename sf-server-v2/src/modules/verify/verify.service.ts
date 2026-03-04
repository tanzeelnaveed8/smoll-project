import { MailerService } from '@nestjs-modules/mailer/dist';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SendGrid from '@sendgrid/mail';
import { Logger } from 'src/configs/logger';
import twilio from 'twilio';

export type UsernameType = 'phone' | 'email' | 'invalid';

@Injectable()
export class VerifyService {
  private readonly logger = Logger.getInstance();

  private readonly client: twilio.Twilio;
  private readonly verifyServiceSid: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {
    this.client = twilio(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN'),
    );
    this.verifyServiceSid = this.configService.get('TWILIO_VERIFY_SERVICE_SID');
    SendGrid.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
  }

  //generate random 4 digit code
  generateVerificationCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  async sendSMSVerificationCode(phoneNumber: string) {
    this.logger.info(`[LOG: VERIFY_SERVICE] Sending OTP to ${phoneNumber}`);

    return await this.client.verify.v2
      .services(this.verifyServiceSid)
      .verifications.create({
        to: phoneNumber,
        channel: 'sms',
      });
  }

  async verifySMSVerificationCode(phoneNumber: string, code: string) {
    this.logger.info(`[LOG: VERIFY_SERVICE] Verifying OTP for ${phoneNumber}`);

    return await this.client.verify.v2
      .services(this.verifyServiceSid)
      .verificationChecks.create({
        to: phoneNumber,
        code: code,
      });
  }

  async sendEmailVerificationCode(email: string) {
    this.logger.info(`[LOG: VERIFY_SERVICE] Sending OTP to ${email}`);
    return await this.client.verify.v2
      .services(this.verifyServiceSid)
      .verifications.create({ to: email, channel: 'email' });
  }

  async sendPhoneVerificationCode(phoneNumber: string) {
    this.logger.info(`[LOG: VERIFY_SERVICE] Sending OTP to ${phoneNumber}`);
    return await this.client.verify.v2
      .services(this.verifyServiceSid)
      .verifications.create({ to: phoneNumber, channel: 'sms' });
  }

  async verifyEmailVerificationCode(email: string, code: string) {
    try {
      this.logger.info(`[LOG: VERIFY_SERVICE] Verifying OTP for ${email}`);
      return await this.client.verify.v2
        .services(this.verifyServiceSid)
        .verificationChecks.create({
          to: email,
          code: code,
        });
    } catch (error) {
      this.logger.error(
        `[LOG: VERIFY_SERVICE] Failed to verify OTP for ${email}`,
        error,
      );
      throw error;
    }
  }

  async verifyPhoneVerificationCode(phoneNumber: string, code: string) {
    try {
      this.logger.info(
        `[LOG: VERIFY_SERVICE] Verifying OTP for ${phoneNumber}`,
      );
      return await this.client.verify.v2
        .services(this.verifyServiceSid)
        .verificationChecks.create({
          to: phoneNumber,
          code: code,
        });
    } catch (error) {
      this.logger.error(
        `[LOG: VERIFY_SERVICE] Failed to verify OTP for ${phoneNumber}`,
        error,
      );
      throw error;
    }
  }

  //send temporary password to user
  async sendTemporaryPassword(email: string, password: string) {
    return this.sendMail({
      to: email,
      from: 'no-reply@smoll.me',
      subject: 'Temporary password',
      text: `Your temporary password is ${password}`,
      html: `<b>Your temporary password is ${password}</b>`,
    });
  }

  async sendMail(mail: SendGrid.MailDataRequired) {
    await SendGrid.send(mail).catch((error) => {
      this.logger.error(error);
    });

    return { statusCode: 200, message: 'Email sent successfully' };
  }
}
