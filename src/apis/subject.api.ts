import requests from "./agent";

export interface Subject {
  subjectId: number;
  name: string;
  schoolType: number;
}

export async function getSubjectsBySchoolLevel(): Promise<Subject[]> {
  try {
    // Token is already handled in agent.ts interceptor
    const data = await requests.get<Subject[]>("/api/Subjects/BySchoolLevel");
    return data;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
}
