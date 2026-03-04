import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Roles } from 'src/decorators/role.decorator';
import { RoleGuard } from 'src/guards/role/role.guard';
import { RolesEnum } from '../../../guards/role/role.enum';
import { CounsellorService } from '../services/counsellor.service';
import {
  CreateCounsellorPayloadDto,
  CreateCounsellorResDto,
} from '../dtos/create.dto';

@ApiTags('Counsellor: Admin Role')
@ApiCookieAuth()
@Controller('/admin/counsellors')
@UseGuards(AuthGuard(), RoleGuard)
@Roles([RolesEnum.ADMIN])
export class CounsellorAdminController {
  constructor(private readonly counsellorService: CounsellorService) {}

  @Post()
  async create(
    @Body() body: CreateCounsellorPayloadDto,
  ): Promise<CreateCounsellorResDto> {
    const counsellor = await this.counsellorService.create(body);

    return plainToInstance(CreateCounsellorResDto, counsellor, {
      excludeExtraneousValues: true,
    });
  }
}
