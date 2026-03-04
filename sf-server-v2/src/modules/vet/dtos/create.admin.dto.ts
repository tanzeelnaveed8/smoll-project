import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsTimeZone,
  IsBoolean,
  IsArray,
  IsEnum,
} from 'class-validator';
import { FindFileResDto } from '../../../modules/file/dto/find.dto';
import { FindOneVetAdminResDto } from './find.admin.dto';
import { IsUUID } from 'class-validator';

export class CreateVetPayloadDto {
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  about?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  designation: string;

  @IsOptional()
  @Type(() => FindFileResDto)
  profileImg?: FindFileResDto;

  @IsOptional()
  @Type(() => FindFileResDto)
  documents?: FindFileResDto[];

  @IsDateString()
  @IsNotEmpty()
  dob: Date;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsTimeZone()
  @IsOptional()
  timeZone: string;

  @IsBoolean()
  @IsOptional()
  byAppointmentOnly?: boolean;

  @IsArray()
  // @IsUUID('all', { each: true })
  // @IsString({ each: true })
  @IsOptional()
  specialityIds?: string[];
}

/** Response */

export class CreateVetResDto extends FindOneVetAdminResDto { }
