import { uniqId } from '../../utils/uniqId';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { RolesEnum } from '../../guards/role/role.enum';
import { PwdService } from '../../modules/auth/services/pwd.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Entity()
@Unique(['email'])
export class Admin extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  name: string | null;

  @Column({ default: RolesEnum.ADMIN })
  role: RolesEnum;

  @Column()
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  generateId() {
    this.id = uniqId();
  }

  static async seed() {
    const adminRepo = this.getRepository();
    const pwdService = new PwdService();

    const defaultAdmin = await adminRepo.findOne({
      where: { email: process.env.ADMIN_EMAIL },
    });

    if (!defaultAdmin) {
      const hashedPwd = await pwdService.hashPwd(process.env.ADMIN_PASSWORD);
      const admin = adminRepo.create({
        email: process.env.ADMIN_EMAIL,
        password: hashedPwd,
        name: process.env.ADMIN_NAME,
      });

      await adminRepo.save(admin);
    }
  }
}
