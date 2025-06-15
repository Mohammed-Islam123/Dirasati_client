import { AxiosError } from "axios";
import requests from "./agent";

export interface Employee {
  employeeId: string;
  fullName: string;
  email: string;
  position: string;
  hireDate: string;
  contractType: string;
  isActive: boolean;
  permissions: number;
}

export interface EmployeesResponse {
  data: Employee[];
  pagination: {
    page: number;
    pageSize: number;
    hasNext: boolean;
  };
}

export interface EmployeeDetails {
  employeeId: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  birthDate: string; // ISO date string (e.g., "0001-01-01")
  position: string;
  hireDate: string; // ISO date string (e.g., "2025-05-24")
  contractType: string;
  isActive: boolean;
  permissions: number;
  phoneNumber: string;
  address: {
    adresseId: number;
    street: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    country: string | null;
  };
  createdAt: string; // ISO date string (e.g., "0001-01-01T00:00:00")
  lastModified: string | null; // ISO date string or null
}

export const getEmployees = async (page: number, pageSize: number) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    const data = await requests.get<EmployeesResponse>(
      "/api/employees",
      params
    );

    const totalPages = data.pagination.hasNext
      ? data.pagination.page + 1
      : data.pagination.page;

    return {
      data: data.data,
      totalPages,
    };
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    throw error;
  }
};

export const getEmployee = async (id: string | null) => {
  try {
    if (!id) return null;

    const data = await requests.get<EmployeeDetails>(`/api/employees/${id}`);
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return null;
    }
    console.error("Failed to fetch employee:", error);
    throw error;
  }
};
