import { create } from "zustand";
import api from "@/utils/api";
import { CasesState } from "../types/case";
import {
  AppointmentListResponseDto,
  AppointmentState,
} from "../types/appointments";

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointment: null,
  appointmentDetails: new Map(),

  fetchAppointments: async (page: number) => {
    const response = await api.get("/member/partners/appointments", {
      params: {
        page: page,
        limit: 10,
      },
    });

    // const existingAppointment = get().appointment || [];
    const data = response.data.data;

    const updatedData = get().appointment || [];
    data.forEach((item: AppointmentListResponseDto) => {
      if (!updatedData.find((existing) => existing.id === item.id)) {
        updatedData.push(item);
      }
    });

    console.log("appointment response data", data);

    set(() => ({
      appointment: updatedData,
      // appointment:
      //   existingAppointment.length > 0 ? [...existingAppointment, ...data] : data,
    }));

    return response.data;
  },

  deleteAppointment: async (id: string) => {
    // const response = await api.delete(`/member/partners/appointments/${id}`);
    get().appointmentDetails.delete(id); // Delete the appointment by ID
    
    set(() => ({
      appointmentDetails: new Map(get().appointmentDetails), // Update state with the modified Map
    }));
  },

  fetchAppointmentDetail: async (id: string) => {
    const response = await api.get(`/member/partners/appointments/${id}`);
    console.log("respnse", response);

    set(() => ({
      appointmentDetails: new Map([
        ...get().appointmentDetails,
        [id, response.data],
      ]),
    }));

    return response.data;
  },
}));

export const appointmentFormatedTime = (data: string) => {
  return new Date(data)
    .toLocaleString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    .replace(/, \d{4}/, "");
};
