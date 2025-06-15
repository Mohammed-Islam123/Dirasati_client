import { AxiosError } from "axios";
import requests from "./agent";

export interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
  studentIdNumber: string;
  parentFullName: string;
  photoUrl: string;
  parentContact: string;
}

export interface StudentsResponse {
  items: Student[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}

export interface StudentDetails {
  studentId: string;
  firstName: string;
  lastName: string;
  address: string;
  birthDate: string;
  birthPlace: string;
  schoolId: string;
  studentIdNumber: string | null;
  emergencyContact: string;
  schoolLevelId: number;
  specializationId: number;
  parentRelationshipToStudentTypeId: number;
  photoUrl: string | null;
  enrollmentDate: string;
  parentId: string;
  isActive: boolean;
  groupId: string | null;
}

export const getStudents = async (page: number, pageSize: number) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    const data = await requests.get<StudentsResponse>(
      "/api/students/list",
      params
    );
    return data;
  } catch (error) {
    console.error("Failed to fetch students:", error);
    throw error;
  }
};

export const getStudent = async (id: string | null) => {
  try {
    if (!id) return null;

    try {
      const data = await requests.get<StudentDetails>(`/api/students/${id}`);
      return data;
    } catch (error: unknown) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.status === 404
      ) {
        return null; // Not found
      }
      throw error;
    }
  } catch (error) {
    console.error("Failed to fetch students:", error);
    throw error;
  }
};
