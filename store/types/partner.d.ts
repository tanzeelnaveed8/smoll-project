import { ExpertAvailability } from "./expert";
import { UploadedFile } from "./file";

export interface PartnerVet {
  id: string;
  name: string;
  designation: string;
  yearsOfExperience: number;
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
  fetchPartnerVetDetails: (
    id: string,
    partnerId: string
  ) => Promise<PartnerVetDetails>;
  fetchPartnerVetAvailability: (
    id: string,
    partnerId: string,
    date?: Date
  ) => Promise<ExpertAvailability[]>;
  bookPartnerVet: (
    id: string,
    partnerId: string,
    caseId: string,
    date: string,
    services: { id: string; label: string }[]
  ) => Promise<{ id: string }>;
  cancelAppointment: (bookingId: string) => Promise<void>;
  rescheduleAppointment: (bookingId: string) => Promise<void>;
}
