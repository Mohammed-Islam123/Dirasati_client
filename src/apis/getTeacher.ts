import { AxiosError } from "axios";
import requests from "./agent";

export interface Teacher {
  teacherId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  hireDate: string; // ISO date string (e.g., "2020-05-24")
  contractTypeId: number;
  contractType: string;
  subjectIds: string[]; // Assuming these are UUIDs or string IDs of subjects
  schoolId: string;
  photo: string;
  address: string | null;
}

export const getTeachers = async (): Promise<Teacher[] | null> => {
  try {
    const data = await requests.get<Teacher[]>("/api/teacher");
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return null;
    }
    console.error("Failed to fetch teachers:", error);
    return null;
  }
};

export const getTeacher = async (id: string | null) => {
  try {
    if (!id) return null;

    const data = await requests.get<Teacher>(`/api/teacher/${id}`);
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return null;
    }
    console.error("Failed to fetch teacher:", error);
    throw error;
  }
};
