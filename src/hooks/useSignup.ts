import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import requests from "../apis/agent";
import { SchoolLevelName } from "../types/register.type";
import { getSchoolLevelCode } from "../utils/schoolLevels";

export const useSignup = () => {
  const [err, setErr] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const naviagte = useNavigate();

  const signup = async (data: {
    school: {
      schoolName: string;
      schoolType: SchoolLevelName;
      schoolEmail: string;
      phoneNumber: string;
      address: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      };
    };
    employee: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
      email: string;
      password: string;
      permission: number;
    };
  }) => {
    setIsLoading(true);
    setErr(null);
    console.log(data);

    try {
      const payload = {
        school: {
          name: data.school.schoolName,
          schoolTypeId: getSchoolLevelCode(data.school.schoolType),
          email: data.school.schoolEmail,
          phoneNumber: data.school.phoneNumber,
          address: {
            street: data.school.address.street,
            city: data.school.address.city,
            state: data.school.address.state,
            postalCode: data.school.address.postalCode,
            country: data.school.address.country,
          },
          specializationsId: [],
          LogoUrl: "",
          websiteUrl: "",
          academicYear: {
            startDate: "2025-04-12",
            endDate: "2025-04-12",
          },
        },
        employee: {
          firstName: data.employee.firstName,
          lastName: data.employee.lastName,
          phoneNumber: data.employee.phoneNumber,
          email: data.employee.email,
          password: data.employee.password,
          permission: data.employee.permission,
        },
      };

      await requests.post("/api/auth/register", payload);

      // Save the user to local storage
      toast.success("create account successfully");
      naviagte("/dashboard");
      // update the auth context if needed
    } catch (error) {
      if (error instanceof Error) {
        toast.error(` ${error.message}`);
        setErr(error.message);
      } else {
        toast.error("An unknown error occurred");
        setErr("must be unknown");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading, err };
};
