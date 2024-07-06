import { create } from "zustand";
import { FileState } from "../types/file";
import api from "@/utils/api";

export const useFileStore = create<FileState>((set, get) => ({
  uploadFile: async (files) => {
    const response = await api.post("/files", files);

    return response.data;
  },
}));
