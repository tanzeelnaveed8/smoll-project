import { Nullable } from "../types";
import { Case } from "./case";
import { UploadedFile } from "./file";

export enum ConsultationStatusEnum {
  INITIATED = "initiated",
  IN_REVIEW = "in_review",
  COMPLETED = "completed",
  REJECTED = "rejected",
}

interface Expert {
  id: string;
  name: string;
  phone: string;
  designation: string;
  address: string;
  country: string;
  //   availability: {};
  isOnline: true;
  yearsOfExperience: Nullable<number>;
  profileImg: Nullable<UploadedFile>;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

interface ExpertAvailability {
  id: string;
  dayOfWeek: string;
  date: string;
  intervals: { from: string; to: string }[];
}

interface RateExpertPayloadDto {
  id: string;
  caseId: string;
  rating: number;
  comment?: string;
}

// Response
export interface FindOneConsultationResDto {
  id: string;
  createdAt: string;
  status: ConsultationStatusEnum;
  case: Case;
  vet: Expert;
}

interface ExpertState {
  expertDetailMap: Map<string, Expert>;
  experts: Nullable<Expert[]>;

  fetchExperts: () => Promise<Expert[]>;
  fetchExpertDetail: (id: string) => Promise<void>;
  fetchExpertAvailability: (
    id: string,
    date?: Date
  ) => Promise<ExpertAvailability[]>;
  findOneConsultation: (id: string) => Promise<FindOneConsultationResDto>;
  requestConsultation: (id: string) => Promise<{ id: string }>;
  updateConsultation: (payload: {
    id: string;
    caseId: string;
  }) => Promise<void>;
  rateExpert: (payload: RateExpertPayloadDto) => Promise<void>;
}
