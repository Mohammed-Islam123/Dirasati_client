// src/api/markAbsence.ts
import { AxiosError } from "axios";
import requests from "./agent";

export async function markAbsences(
  groupId: string,
  studentIds: string[]
): Promise<void> {
  try {
    await requests.post(`/api/Absence/mark/${groupId}`, studentIds);
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`HTTP error! status: ${error.response?.status}`);
    }
    console.error("Failed to mark absences:", error);
    throw error;
  }
}

export interface TeacherReportRequest {
  studentId: string;
  title: string;
  description: string;
  reportDate: string; // ISO format e.g., "2025-05-27T04:16:01.776Z"
}

export async function addTeacherReport(report: TeacherReportRequest) {
  try {
    const result = await requests.post("/api/teacher/reports/add", report);
    return result;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`HTTP error! status: ${error.response?.status}`);
    }
    console.error("Failed to add teacher report:", error);
    throw error;
  }
}
