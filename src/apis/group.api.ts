import { AxiosError } from "axios";
import requests from "./agent";

export interface GroupResponse {
  groupId: string;
  groupName: string;
  levelId: number;
  groupCapacity: number;
  studentCount: number;
  level: {
    levelId: number;
    year: number;
    specialization: string;
    schoolType: string;
  };
}

export const GetStudentGroup = async () => {
  try {
    const result = await requests.get<GroupResponse[]>("/api/Groups");
    return result;
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    return [] as GroupResponse[];
  }
};

export type CreateGroupPayload = {
  groupName: string;
  classroomId: string;
  studentIds: string[];
};

export const createStudentGroup = async (payload: CreateGroupPayload) => {
  try {
    const result = await requests.post("/api/group/students", payload);
    alert("Group created successfully!");
    return result;
  } catch (error) {
    console.error("Failed to create group:", error);
    throw error;
  }
};

export interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
  studentIdNumber: string;
  parentName: string;
  parentContact: string;
  parentEmail: string;
  email?: string;
  photoUrl?: string;
  phone?: string;
  enrollmentDate?: string;
  birthDate?: string;
}

export async function getStudentsByGroup(groupId: string): Promise<Student[]> {
  try {
    const data = await requests.get<Student[]>(
      `/api/group/students/by-group/${groupId}`
    );
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`HTTP error! status: ${error.response?.status}`);
    }
    console.error("Failed to fetch students by group:", error);
    throw error;
  }
}

export async function assignStudentToGroup(
  studentId: string,
  groupId: string
): Promise<string> {
  try {
    const data = await requests.post("/api/Groups/assign-student", {
      studentId,
      groupId,
    });
    return typeof data === "string" ? data : JSON.stringify(data);
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error assigning student to group:", error.response?.data);
      return `Error: HTTP ${error.response?.status}`;
    }
    console.error("Error assigning student to group:", error);
    return `Error: ${(error as Error).message}`;
  }
}

export interface UpdateGroupPayload {
  groupName: string;
  groupCapacity: number;
  studentIds: string[];
}

export const updateGroup = async (
  groupId: string,
  payload: UpdateGroupPayload
) => {
  try {
    const result = await requests.put(`/api/Groups/${groupId}`, payload);
    alert("Group updated successfully!");
    return result;
  } catch (error) {
    console.error("Failed to update group:", error);
    throw error;
  }
};

export const deleteGroup = async (groupId: string) => {
  try {
    await requests.delete(`/api/Groups/${groupId}`);
    alert("Group deleted successfully!");
  } catch (error) {
    console.error("Failed to delete group:", error);
    throw error;
  }
};
