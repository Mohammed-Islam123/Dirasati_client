import { AxiosError } from "axios";
import requests from "./agent";

export interface Classroom {
  classroomId: string;
  className: string;
  schoolLevelId: number;
  specializationId: number;
  levelName: string;
  specializationName: string;
  schoolType: string;
}

export async function getClassrooms(): Promise<Classroom[] | string> {
  try {
    const data = await requests.get<Classroom[]>("/api/classrooms");
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`HTTP error! status: ${error.response?.status}`);
    }
    console.error("Failed to fetch classrooms:", error);
    throw error;
  }
}
