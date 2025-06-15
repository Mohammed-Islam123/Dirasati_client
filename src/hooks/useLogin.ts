import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useRoleStore } from "../store/utls";
import requests from "../apis/agent";

export interface DecodedToken {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
  SchoolId: string;
  exp: number;
  iat: number;
  SchoolTypeId: string;
  Permission: string;
  TeacherId: string;
  EmployeeId: string;
}

interface LoginResponse {
  token: string;
  refreshToken?: string;
}

export const Uselogin = () => {
  const [err, setErr] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { role } = useRoleStore();

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setErr(false);

    const endpoint =
      role === "admin" ? "api/auth/login" : "api/teacher/auth/login";

    try {
      const json = await requests.post<LoginResponse>(endpoint, {
        email,
        password,
      });

      const decoded: DecodedToken = jwtDecode(json.token);

      // Store token and common user data
      localStorage.setItem("dirasati_token", json.token);
      // Store refresh token if available
      if (json.refreshToken) {
        localStorage.setItem("dirasati_refreshtoken", json.refreshToken);
      }

      localStorage.setItem("SchoolId", decoded.SchoolId);
      localStorage.setItem("role", decoded.Permission);
      localStorage.setItem("shool", decoded.SchoolTypeId); // do change this to SchoolTypeId

      // Store role-specific ID
      if (role === "admin") {
        localStorage.setItem("employeeId", decoded.EmployeeId);
      } else {
        localStorage.setItem("teacherId", decoded.TeacherId);
      }

      toast.success("Logged in successfully");

      // Redirect based on role if needed
      const redirectPath =
        role === "admin" ? "/dashboard" : "/Teacherdashboard/profile";
      navigate(redirectPath);
    } catch (error) {
      setIsLoading(false);
      setErr(true);
      if (error instanceof Error) {
        toast.error(`Login failed: ${error.message}`);
      } else {
        toast.error("An unknown error occurred during login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, err };
};
