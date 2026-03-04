import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Counsellor } from '../entities/counsellor.entity';
import { PwdService } from '../../auth/services/pwd.service';
import { VerifyService } from '../../verify/verify.service';
import { CreateCounsellorPayloadDto } from '../dtos/create.dto';

@Injectable()
export class CounsellorService {
  constructor(
    @InjectRepository(Counsellor)
    private readonly counsellorRepo: Repository<Counsellor>,
    private readonly pwdService: PwdService,
    private readonly verifyService: VerifyService,
  ) {}

  async findOneByEmail(email: string): Promise<Counsellor> {
    const counsellor = await this.counsellorRepo.findOne({ where: { email } });
    return counsellor;
  }

  async findAll(): Promise<Counsellor[]> {
    const counsellors = await this.counsellorRepo.find();
    return counsellors;
  }

  async create(body: CreateCounsellorPayloadDto): Promise<Counsellor> {
    const queryRunner =
      this.counsellorRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const _counsellor = this.counsellorRepo.create(body);

      const pwd = this.pwdService.getTempPwd();

      _counsellor.password = await this.pwdService.hashPwd(pwd);

      const counsellor = await queryRunner.manager.save(_counsellor);

      await queryRunner.commitTransaction();
      this.verifyService.sendTemporaryPassword(counsellor.email, pwd);

      return counsellor;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      if (err.code === '23505') {
        throw new BadRequestException('Email or phone already exists');
      }

      throw new InternalServerErrorException('Failed to create user');
    } finally {
      await queryRunner.release();
    }
  }
}
