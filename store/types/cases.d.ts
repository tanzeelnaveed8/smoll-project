import { Nullable, UploadedFile } from "../types";

export type CaseDataDto = {
  name: string;
  forwardBy: string;
  caseId: string;
  nuOfRequest: number;
};

export type CaseRequestsDto = {
  title: string;
  id: string;
  rating: number;
  address: string;
};

export interface CasesState {
  casesList: CaseDataDto[];
  caseRequests: CaseRequestsDto[];
  fetchCases: () => Promise<void>;
  fetchCaseRequests: () => Promise<void>;
}
