import toast from "react-hot-toast";
import requests from "./agent";

export interface Levels {
  levelId: number;
  levelYear: number;
  schoolTypeId: number;
  schoolTypeName: string;
}

export interface Relationship {
  id: number;
  name: string;
}

export interface Specializations {
  specializationId: number;
  name: string;
}

export const getLevels = async () => {
  try {
    const json = await requests.get<Levels[]>("/api/Levels");
    const SchoolTypeId = Number(localStorage.getItem("shool"));

    return json.filter((item) => SchoolTypeId == item.schoolTypeId);
  } catch (error) {
    toast.error("Failed to fetch levels:");
    console.log(error);
    return [];
  }
};

export const getRelationship = async () => {
  try {
    const json = await requests.get<Relationship[]>(
      "/api/RelationshipToStudent"
    );
    return json;
  } catch (error) {
    toast.error("Failed to fetch Relationship:");
    console.log(error);
    return [];
  }
};

export const getSpecializations = async () => {
  try {
    const json = await requests.get<Specializations[]>(
      "/api/Levels/specializations"
    );
    return json;
  } catch (error) {
    toast.error("Failed to fetch Specializations:");
    console.log(error);
    return [];
  }
};
