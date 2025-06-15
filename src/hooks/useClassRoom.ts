import toast from "react-hot-toast";
import requests from "../apis/agent";
import { CreateClassroomRequest, UpdateClassroomRequest } from "../types/types";

export async function createClassroom(
  newClass: CreateClassroomRequest
): Promise<string> {
  try {
    const payload = {
      className: newClass.className,
      schoolLevelId: Number(newClass.schoolLevelId),
      specializationId: Number(newClass.specializationId),
    };

    return await requests.post<string>("/api/classrooms", payload);
  } catch (error) {
    if (error instanceof Error) {
      toast.error(`Error creating classroom: ${error.message}`);
    } else {
      toast.error("An unknown error occurred when creating classroom");
    }
    throw error;
  }
}

export async function updateClassroom(
  classroomId: string,
  data: UpdateClassroomRequest
): Promise<string> {
  try {
    return await requests.put<string>(`/api/classrooms/${classroomId}`, data);
  } catch (error) {
    if (error instanceof Error) {
      toast.error(`Error updating classroom: ${error.message}`);
    } else {
      toast.error("An unknown error occurred when updating classroom");
    }
    throw error;
  }
}

export async function deleteClassroom(classroomId: string): Promise<void> {
  try {
    await requests.delete<void>(`/api/classrooms/${classroomId}`);
  } catch (error) {
    if (error instanceof Error) {
      toast.error(`Error deleting classroom: ${error.message}`);
    } else {
      toast.error("An unknown error occurred when deleting classroom");
    }
    throw error;
  }
}
