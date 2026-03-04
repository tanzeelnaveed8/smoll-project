import { ConfigService, ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { VerifyService } from './verify.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('EMAIL_HOST'),
          port: configService.get('EMAIL_PORT'),
          secure: false, //parse to boolean from string
          ignoreTLS: true,
          auth: {
            user: configService.get('EMAIL_USERNAME'),
            pass: configService.get('EMAIL_PASSWORD'),
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [VerifyService],
  exports: [VerifyService],
})
export class VerifyModule {}
