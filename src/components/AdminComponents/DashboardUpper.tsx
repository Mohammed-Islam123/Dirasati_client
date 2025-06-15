import SearchBar from "../../components/ui/SearchBar";
//import Image1 from '../../assets/image copy 4.png'
import { EmployeeDetails } from "../../apis/getEmployee";
import { getEmployee } from "../../apis/getEmployee";
import { useState, useEffect } from "react";

const DashboardUpper = () => {
  const id = localStorage.getItem("employeeId");
  const [employee, setEmployee] = useState<EmployeeDetails | null>(null);
  const [, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchEmployee = async () => {
      const employeeData = await getEmployee(id as string);
      setEmployee(employeeData ?? null);
    };

    fetchEmployee();
  }, [id]);
  return (
    <div className="w-[90%] p-2 m-auto mb-10 flex items-center justify-between pt-4">
      <SearchBar setSearchTerm={setSearchTerm} />
      <div className="flex items-center gap-2">
        <img
          src={"https://avatars.githubusercontent.com/u/124599?v=4"}
          alt="user image"
          className="rounded-[50%] w-[48px] h-[48px]"
        />
        <div>
          <h2 className="font-semibold">{employee?.fullName}</h2>
          <span className="text-gray-500 text-[12px]">
            {employee?.position}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardUpper;
