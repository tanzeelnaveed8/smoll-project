import { Expose } from 'class-transformer';

export class FindAnalyticsResDto {
  @Expose()
  cases: number;

  @Expose()
  partners: number;

  @Expose()
  vets: number;

  @Expose()
  members: number;
}

export class FindOneAdminResDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;
}
