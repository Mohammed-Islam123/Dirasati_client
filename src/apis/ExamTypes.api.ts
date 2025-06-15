import { AxiosError } from "axios";
import requests from "./agent";

export interface ExamType {
  examTypeId: number;
  name: string;
}

export async function getExamTypes(): Promise<ExamType[] | string> {
  try {
    const data = await requests.get<ExamType[]>("/api/ExamTypes");
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`HTTP error! status: ${error.response?.status}`);
    }
    console.error("Failed to fetch exam types:", error);
    throw error;
  }
}
