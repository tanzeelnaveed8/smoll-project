import { Nullable, UploadedFile } from "../types";

export enum CaseStatusEnum {
  OPEN = "open",
  OPEN_ESCALATED = "open_escalated",
  CLOSED = "closed",
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
  description: string;
  assets: UploadedFile[];
}

interface Case {
  id: string;
  description: string;
  createdAt: string;
  assets: UploadedFile[];
  status: CaseStatusEnum;
}

export interface CasesState {
  casesList: CaseDataDto[];
  caseRequests: CaseRequestsDto[];
  vetDoctorList: VetDoctorListDto[];

  createCase: (payload: CreateCasePayloadDto) => Promise<{ id: string }>;
  fetchCases: () => Promise<void>;
  fetchCaseRequests: () => Promise<void>;
  fetchVetDoctors: () => Promise<void>;
}
