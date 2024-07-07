import { Nullable, UploadedFile } from "../types";

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

export interface CasesState {
  casesList: CaseDataDto[];
  caseRequests: CaseRequestsDto[];
  vetDoctorList: VetDoctorListDto[];
  fetchCases: () => Promise<void>;
  fetchCaseRequests: () => Promise<void>;
  fetchVetDoctors: () => Promise<void>;
}
