import { Nullable } from "../types";
import { Expert } from "./expert";
import { UploadedFile } from "./file";
import { Pet, PetDetail } from "./pet";

export interface AppointmentListResponseDto {
  id: string;
  scheduledAt: string;
  partner: {
    id: string;
    name: string;
  };
  vet: {
    id: string;
    name: string;
    profileImg: {
      filename: string;
      filesize: number;
      mimetype: string;
      url: string;
    };
  };
  pet: {
    name: string;
  };
}

export interface AppointmentDetailResponseDto {
  id: string;
  scheduledAt: string;
  partner: {
    id: string;
    name: string;
    address: string;
  };
  vet: {
    id: string;
    name: string;
    profileImg: {
      filename: string;
      filesize: number;
      mimetype: string;
      url: string;
    };
  };
  pet: {
    name: string;
    photos: {
      filename: string;
      filesize: number;
      mimetype: string;
      url: string;
    }[];
  };
}

export interface AppointmentState {
  appointment: Nullable<AppointmentListResponseDto[]>;
  appointmentDetails: Map<string, AppointmentDetailResponseDto>;

  fetchAppointments: (
    page: number
  ) => Promise<{ data: AppointmentListResponseDto[]; nextPage: number }>;
  fetchAppointmentDetail: (id: string) => Promise<AppointmentDetailResponseDto>;
  deleteAppointment: (id: string) => Promise<void>;
}
