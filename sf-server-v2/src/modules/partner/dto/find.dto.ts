import { Expose, Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FindFileResDto } from '../../../modules/file/dto/find.dto';
import { FindAvailabilitiesResDto } from '../../../modules/vet/dtos/find.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FindPartnerQueryDto {
  @IsString()
  @IsOptional()
  caseId?: string;
}

export class FindAppointmentCalendarQueryDto {
  @IsString()
  @IsNotEmpty()
  startDate: Date;

  @IsString()
  @IsOptional()
  type?: 'weekly' | 'monthly';

  @IsString()
  @IsOptional()
  vetId?: string;
}

export class FindPartnerCustomersQueryDto {
  @IsString()
  @IsOptional()
  search?: string;
}

/** Responses */

export class FindPartnerSpecialityResDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

export class FindPartnerResDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  receptionistName: string;

  @Expose()
  phone: string;

  @Expose()
  email: string;

  @Expose()
  clinicImg: FindFileResDto | null;

  @Expose()
  imgCollections: FindFileResDto[] | null;

  @Expose()
  address: string | null;

  @Expose()
  country: string | null;

  @Expose()
  city: string | null;

  @Expose()
  openingHours: string | null;

  @Expose()
  postalCode: string | null;

  @Expose()
  timeZone: string;

  @Type(() => FindPartnerSpecialityResDto)
  @Expose()
  specialities: FindPartnerSpecialityResDto[];

  @Expose()
  createdAt: Date;
}

export class FindAllPartnerVetsResDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  about: string | null;

  @Expose()
  email: string | null;

  @Expose()
  phone: string | null;

  @Expose()
  designation: string;

  @Expose()
  isSuspended: boolean;

  @Expose()
  @Type(() => FindFileResDto)
  profileImg: FindFileResDto | null;

  @Expose()
  labelColor: string | null;

  @Expose()
  createdAt: Date;
}

export class FindOnePartnerVetResDto extends FindAllPartnerVetsResDto {
  @Expose()
  @Type(() => FindAvailabilitiesResDto)
  availabilities: FindAvailabilitiesResDto[];

  @Expose()
  yearsOfExperience: number;
}

export class FindPartnerServiceResDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  type: string;

  @Expose()
  price: number;

  @Expose()
  currency: string;

  @Expose()
  quickBooking: boolean;
}
export class FindPartnerQuoteResDto {
  @Expose()
  id: string;

  @Expose()
  note: string;

  @Expose()
  @Type(() => FindPartnerServiceResDto)
  services: FindPartnerServiceResDto[];
}

export class FindPartnerAppointmentResDto {
  @Expose()
  id: string;

  @Expose()
  @Transform(({ obj, value }) => obj.case?.id ?? value)
  caseId: string;

  @Expose()
  scheduledAt: Date;

  @Expose()
  @Transform(({ obj, value }) => obj.vet?.labelColor ?? value)
  labelColor: string | null;

  @Expose()
  isNew: boolean;

  @Expose()
  @Transform(({ obj, value }) => obj.member?.name ?? value)
  member: string;
}

export class FindPartnerCustomerResDto {
  @Expose()
  id: string;

  @Expose()
  name: string | null;

  @Expose()
  email: string | null;

  @Expose()
  phone: string | null;

  @Expose()
  visits: number;

  @Expose()
  orders: number;

  @Expose()
  pets: number;

  @Expose()
  lastVisitAt: Date | null;
}

export class FindPartnerFinanceResDto {
  @Expose()
  completedVisits: number;

  @Expose()
  upcomingVisits: number;

  @Expose()
  cancelledVisits: number;

  @Expose()
  totalRevenue: number;

  @Expose()
  currency: string;
}

export class FindPartnerInvoiceServiceResDto {
  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  label: string;
}

export class FindPartnerInvoiceResDto {
  @Expose()
  id: string;

  @Expose()
  appointmentId: string;

  @Expose()
  paymentIntentId: string;

  @Expose()
  scheduledAt: Date | null;

  @Expose()
  @Type(() => FindPartnerInvoiceServiceResDto)
  services: FindPartnerInvoiceServiceResDto[];

  @Expose()
  subtotal: number;

  @Expose()
  total: number;

  @Expose()
  currency: string;

  @Expose()
  memberName: string | null;

  @Expose()
  memberEmail: string | null;

  @Expose()
  memberPhone: string | null;
}

export class FindAppointmentCalendarResDto {
  @Expose()
  appointments: FindPartnerAppointmentResDto[];

  @Expose()
  lastDate: string | null;
}

export class FindPartnerPayloadDto {
  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsString()
  city?: string;
}
