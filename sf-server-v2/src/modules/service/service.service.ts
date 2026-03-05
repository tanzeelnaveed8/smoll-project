import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { Service } from './service.entity';
import { CreateServiceDto } from './dto/create.dto';
import { UpdateServiceDto } from './dto/update.dto';
import { FindAllServiceQueryDto } from './dto/find.dto';
import { paginate, PaginationResult } from 'src/utils/pagination';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
  ) {}

  async create(dto: CreateServiceDto): Promise<Service> {
    const service = this.serviceRepo.create(dto);
    return this.serviceRepo.save(service);
  }

  async findAll(
    query: FindAllServiceQueryDto,
  ): Promise<PaginationResult<Service>> {
    const { search, ...pageQuery } = query;

    const findOptions: FindManyOptions<Service> = {
      where: search ? { name: ILike(`%${search}%`) } : undefined,
      order: { createdAt: 'DESC' },
    };

    return paginate(this.serviceRepo, pageQuery, findOptions);
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.serviceRepo.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException(`Service with id "${id}" not found`);
    }
    return service;
  }

  async update(id: string, dto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOne(id);
    Object.assign(service, dto);
    return this.serviceRepo.save(service);
  }

  async remove(id: string): Promise<void> {
    const service = await this.findOne(id);
    await this.serviceRepo.remove(service);
  }
}
