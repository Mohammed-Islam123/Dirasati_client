import React, { useEffect, useState } from "react";
import uploadFileToCloudinary from "../../config/UploadCloudinary";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import requests from "../../apis/agent";
import { Contract, Subject, TeacherPayload } from "../../types/types";

const AddTeacher = () => {
  const [selectedMatieres, setSelectedMatieres] = useState<number[]>([]);
  const [fileText, setFileText] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState({
    nom: "",
    prénom: "",
    addresse: "",
    email: "",
    phone: "",
    contractTypeId: 0,
    contractName: "",
    file: "",
    date_début: "",
    matière: [] as number[],
  });

  const ChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeacher({ ...teacher, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileURL = await uploadFileToCloudinary(file, "raw");
      if (fileURL) {
        setTeacher((prev) => ({ ...prev, file: fileURL }));
        setFileText("Image uploaded successfully");
      }
    }
  };

  const handleMatieresChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const matière = parseInt(e.target.value, 10);
    setSelectedMatieres((prevMatieres) => {
      const newMatieres = prevMatieres.includes(matière)
        ? prevMatieres.filter((m) => m !== matière)
        : [...prevMatieres, matière];

      setTeacher((prev) => ({ ...prev, matière: newMatieres }));
      return newMatieres;
    });
  };

  const handleContractChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedContractId = parseInt(e.target.value, 10);

    setTeacher((prev) => ({
      ...prev,
      contractTypeId: selectedContractId,
    }));

    const contract = contracts.find(
      (c) => c.contractTypeId === selectedContractId
    );
    if (contract) {
      setTeacher((prev) => ({ ...prev, contractName: contract.name }));
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const data = await requests.get<{ subjects: Subject[] }>(
          `/api/Subjects/BySchoolLevel`
        );
        const contractsData = await requests.get<Contract[]>(
          `/api/teacher/contract-types`
        );

        setSubjects(data.subjects);
        setContracts(contractsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const schoolId = localStorage.getItem("SchoolId");

    try {
      const payload: TeacherPayload = {
        email: teacher.email,
        firstName: teacher.prénom,
        lastName: teacher.nom,
        phoneNumber: teacher.phone,
        hireDate: teacher.date_début,
        contractTypeId: teacher.contractTypeId,
        contractType: teacher.contractName,
        subjectIds: teacher.matière,
        schoolId: schoolId,
        address: { fullAddress: teacher.addresse },
      };

      console.log("📦 Request body to send:", payload);

      await requests.post<void>(`/api/teacher/create`, payload);

      toast.success("Teacher created successfully");
      navigate("/dashboard/enseignants");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h1 className="text-2xl mt-2 font-bold text-gray-800 mb-8">
        Ajouter un Enseignant
      </h1>

      {/* Personal Information Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="bg-[var(--color-yousra)] px-6 py-4">
          <h2 className="text-xl font-semibold text-white">
            Informations Personnelles
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Photo Upload */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo*
            </label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileUpload}
              />
              <div className="text-center p-4">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-1 text-sm text-gray-600">
                  Cliquez pour télécharger
                </p>
              </div>
            </div>
            {fileText && (
              <p className="mt-2 text-sm text-green-600">{fileText}</p>
            )}
          </div>

          {/* Left Column */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom*
              </label>
              <input
                type="text"
                name="nom"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-[var(--color-yousra)] 
                             focus:border-[var(--color-yousra)]"
                onChange={ChangeHandler}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse Email*
              </label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-[var(--color-yousra)] 
                             focus:border-[var(--color-yousra)]"
                onChange={ChangeHandler}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse*
              </label>
              <input
                type="text"
                name="addresse"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-[var(--color-yousra)] 
                             focus:border-[var(--color-yousra)]"
                onChange={ChangeHandler}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom*
              </label>
              <input
                type="text"
                name="prénom"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-[var(--color-yousra)] 
                             focus:border-[var(--color-yousra)]"
                onChange={ChangeHandler}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro De Téléphone*
              </label>
              <input
                type="text"
                name="phone"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-[var(--color-yousra)] 
                             focus:border-[var(--color-yousra)]"
                onChange={ChangeHandler}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Professional Information Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-[var(--color-yousra)] px-6 py-4">
          <h2 className="text-xl font-semibold text-white">
            Informations Professionnelles
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Contract Start Date */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Début*
            </label>
            <input
              type="date"
              name="date_début"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-yousra)] focus:border-transparent"
              onChange={ChangeHandler}
            />
          </div>

          {/* Contract Type */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type Contrat*
            </label>
            <select
              name="contractTypeId"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-yousra)] focus:border-transparent"
              onChange={handleContractChange}
              value={teacher.contractTypeId}
            >
              <option value={0}>-- Sélectionner --</option>
              {contracts.map((contract) => (
                <option
                  key={contract.contractTypeId}
                  value={contract.contractTypeId}
                >
                  {contract.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subjects Taught */}
          <div className="md:col-span-3 md:col-start-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matières enseignées
            </label>
            <select
              multiple
              className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedMatieres.map(String)}
              onChange={handleMatieresChange}
            >
              {subjects.map((subject) => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-5 flex justify-between items-center">
            <Link to={"/dashboard/enseignants"}>
              <button className="w-full md:w-auto px-6 py-3 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-yousra)] focus:ring-offset-2 transition-colors flex items-center justify-center">
                Annuler
              </button>
            </Link>
            <button
              className="px-6 py-3 bg-[var(--color-yousra)] text-white font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              onClick={handelSubmit}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  En cours...
                </span>
              ) : (
                "Ajouter l'enseignant"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTeacher;
