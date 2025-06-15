import requests from "./agent";
import axios from "axios";

export async function downloadNotesTemplate(groupId: string): Promise<void> {
  try {
    // Using axios directly for blob response handling
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/Notes/template`,
      {
        params: { groupId },
        responseType: "blob",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${localStorage.getItem("dirasati_token")}`,
        },
      }
    );

    const blob = response.data;
    const url = window.URL.createObjectURL(blob);

    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers["content-disposition"];
    let filename = "template.csv";
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match?.[1]) filename = match[1];
    }

    // Trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
  }
}

interface UploadFormData {
  tremester: string;
  academicYearId: string;
  examTypeId: string;
  subjectId: string;
}

export async function uploadNotesCSV(
  file: File,
  groupId: string,
  formDataState: UploadFormData
): Promise<void> {
  const formData = new FormData();
  formData.append("CsvFile", file);
  formData.append("GroupId", groupId);
  formData.append("Tremester", formDataState.tremester);
  formData.append("AcademicYearId", "1");
  formData.append("ExamTypeId", formDataState.examTypeId);
  formData.append("SubjectId", formDataState.subjectId);

  try {
    await requests.postForm("/api/Notes/bulk", formData);
    console.log("Upload successful");
  } catch (error) {
    console.error("Upload error:", error);
  }
}
