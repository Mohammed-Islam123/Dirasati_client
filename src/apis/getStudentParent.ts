import { AxiosError } from "axios";
import requests from "./agent";

export interface Parent {
  parentId: string;
  firstName: string;
  lastName: string;
  occupation: string;
  relationshipToStudent: string;
  email: string;
  phoneNumber: string;
}

export const getStudentParent = async (id: string | null) => {
  try {
    if (!id) return null;

    const data = await requests.get<Parent>(`/api/parents/${id}/parent`);
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return null;
    }
    console.error("Failed to fetch parent:", error);
    throw error;
  }
};
