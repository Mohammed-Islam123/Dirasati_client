import requests from "./agent";

interface ConvocationData {
  studentId: string | undefined;
  titre: string;
  motif: string;
  date: string;
}

export const sendConvocation = async (data: ConvocationData) => {
  try {
    const result = await requests.post("/api/teacher/reports/add", {
      studentId: data.studentId,
      title: data.titre,
      description: data.motif,
      reportDate: data.date,
    });

    return result;
  } catch (error) {
    console.error("Failed to send convocation:", error);
    throw error;
  }
};
