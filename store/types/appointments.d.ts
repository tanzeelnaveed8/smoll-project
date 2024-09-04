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
    clinicImg: {
      filename: string;
      filesize: number;
      mimetype: string;
      url: string;
    };
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
  type: "in-clinic" | "video";
}

export interface AppointmentDetailResponseDto {
  id: string;
  scheduledAt: string;
  partner: {
    id: string;
    name: string;
    address: string;
    clinicImg: {
      filename: string;
      filesize: number;
      mimetype: string;
      url: string;
    };
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
  case: {
    id: string;
    pet: {
      name: string;
      photos: {
        filename: string;
        filesize: number;
        mimetype: string;
        url: string;
      }[];
    };
  };

  services: {
    id: string;
    name: string;
    description: string;
    price: number;
    label: string;
  };
  [];
}

export interface AppointmentState {
  appointment: Nullable<AppointmentListResponseDto[]>;
  appointmentDetails: Map<string, AppointmentDetailResponseDto>;

  fetchAppointments: (
    page: number,
    reset?: boolean
  ) => Promise<{ data: AppointmentListResponseDto[]; nextPage: number }>;
  fetchAppointmentDetail: (id: string) => Promise<AppointmentDetailResponseDto>;
  deleteAppointment: (id: string) => Promise<void>;
  cancelAppointment: (bookingId: string) => Promise<void>;
  rescheduleAppointment: (bookingId: string) => Promise<void>;
}
