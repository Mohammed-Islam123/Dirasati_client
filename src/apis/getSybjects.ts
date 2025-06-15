import { getTeacher } from "./getTeacher";

// This function was duplicating getTeacher functionality
// Keeping it for backward compatibility but using the existing getTeacher function
export const getSybjects = getTeacher;
