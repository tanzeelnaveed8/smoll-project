import { Nullable, UploadedFile } from "../types";
import { Expert } from "./expert";
import { Pet, PetDetail } from "./pet";

export enum CaseStatusEnum {
  OPEN = "open",
  OPEN_ESCALATED = "openEscalated",
  CLOSED = "closed",
  SCHEDULED = "scheduled",
}

type CaseDataDto = {
  name: string;
  forwardBy: string;
  caseId: string;
  nuOfRequest: number;
};

type CaseRequestsDto = {
  title: string;
  id: string;
  rating: number;
  address: string;
};

type VetDoctorListDto = {
  name: string;
  speciality: string;
  experience: number;
  verified: boolean;
  nextAvailable: string;
};

interface CreateCasePayloadDto {
  petId: string;
  vetId: string;
  description: string;
  assets: UploadedFile[];
  status: CaseStatusEnum;
}

export interface Case {
  id: string;
  description: string;
  createdAt: string;
  assets: UploadedFile[];
  status: CaseStatusEnum;
}

export interface CaseListResponseDto {
  id: string;
  pet: {
    name: string;
    photos?: UploadedFile[];
  };
  vet: string;
  status: CaseStatusEnum;
  scheduledAt?: string;
  requestCount?: number;
  createdAt: string;
}

export interface CaseDetail {
  id: string;
  description: string;
  createdAt: string;
  assets: UploadedFile[];
  vetNote: Nullable<string>;
  status: CaseStatusEnum;
  pet: PetDetail;
  assignedVet: Expert;
  scheduledAt?: string;
}

export interface CasesState {
  cases: Nullable<CaseListResponseDto[]>;

  caseRequests: CaseRequestsDto[];
  vetDoctorList: VetDoctorListDto[];

  createCase: (payload: CreateCasePayloadDto) => Promise<{ id: string }>;
  removeCase: (id: string) => Promise<void>;
  fetchCases: () => Promise<void>;
  fetchCase: (id: string) => Promise<CaseDetail>;
  fetchVetDoctors: () => Promise<void>;
}
