import { ExpertAvailability } from "./expert";
import { UploadedFile } from "./file";

export interface PartnerVet {
  id: string;
  name: string;
  designation: string;
  yearOfExperience: number;
  profileImg: UploadedFile;
}

export interface PartnerVetDetails extends PartnerVet {
  availabilities: ExpertAvailability[];
  partnerName: string;
  partnerAddress: string;
}

export interface State {
  partnerVets: Map<string, PartnerVet[]>;
  partnerVetDetails: Map<string, PartnerVetDetails>;

  fetchPartnerVets: (partnerId: string) => Promise<void>;
  fetchPartnerVetDetails: (id: string, partnerId: string) => Promise<void>;
}
