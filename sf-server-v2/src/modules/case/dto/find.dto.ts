import { Expose, Type } from 'class-transformer';
import { CaseStatusEnum } from '../enums/case-status.enum';
import { FindFileResDto } from '../../../modules/file/dto/find.dto';
import { FindOneMemberResDto } from '../../../modules/member/dtos/find.dto';
import { FindOnePetResDto } from '../../../modules/pet/dto/find.dto';

export class FindAllCasesResDto {
  @Expose()
  id: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => FindFileResDto)
  assets: FindFileResDto[];

  @Expose()
  notes: Record<string, string>[];

  @Expose()
  serviceChecklist: {
    id: string;
    name: string;
    description: string;
    price: number;
    checked: boolean;
    isExtra: boolean;
  }[];

  @Expose()
  customerReachabilityStatus: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => FindOneMemberResDto)
  member?: FindOneMemberResDto;

  @Expose()
  @Type(() => FindOnePetResDto)
  pet?: FindOnePetResDto;

  @Expose()
  status: CaseStatusEnum;
}

export class FindOneCaseResDto extends FindAllCasesResDto {}
