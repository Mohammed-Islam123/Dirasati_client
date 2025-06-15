import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FaCity } from "react-icons/fa"; // Icône pour Ville
import { MdOutlineMap } from "react-icons/md"; // Icône pour Région
import { FaMapPin } from "react-icons/fa"; // Icône pour Code postal
import { BiMap } from "react-icons/bi";
import { codesPostauxAlgerie } from "../../constants/codePostaux";
import requests from "../../apis/agent";
import { Contract, EmployeePayload } from "../../types/types";

const AddEmployee = () => {
  const [, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState<Contract[]>([]);

  const [employee, setEmployee] = useState({
    nom: "",
    prénom: "",
    addresse: "",
    email: "",
    phone: "",
    contractTypeId: 0,
    date_début: "",
    date_naissance: "",
    ville: "",
    région: "",
    code_postal: "",
    street: "",
    position: "",
  });
  const [state, setState] = useState([""]);
  const [wilaya, setWilaya] = useState<string>("Oran");

  const navigate = useNavigate();

  const handleSelectWilaya = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEmployee((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setWilaya(e.target.value);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEmployee((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  useEffect(() => {
    const selectedwilaya = codesPostauxAlgerie.find(
      (element) => element.wilaya === wilaya
    );
    setState(selectedwilaya ? selectedwilaya.regions : []);
  }, [wilaya]);

  const ChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
    console.log(employee);
  };

  const handleContractChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedContractId = parseInt(e.target.value, 10);

    setEmployee((prev) => ({
      ...prev,
      contractTypeId: selectedContractId,
    }));

    const contract = contracts.find(
      (c) => c.contractTypeId === selectedContractId
    );
    if (contract) {
      setEmployee((prev) => ({ ...prev, contractName: contract.name }));
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const data = await requests.get<Contract[]>(
          "/api/teacher/contract-types"
        );
        setContracts(data);
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

    try {
      const payload: EmployeePayload = {
        email: employee.email,
        firstName: employee.prénom,
        lastName: employee.nom,
        birthDate: employee.date_naissance,
        position: employee.position,
        hireDate: employee.date_début,
        contractType: employee.contractTypeId.toString(),
        permissions: 2147483647,
        isActive: true,
        street: employee.street,
        city: employee.ville,
        state: employee.région,
        postalCode: employee.code_postal,
        country: "Algérie",
        phoneNumber: employee.phone,
      };

      console.log("Payload:", payload);

      await requests.post<void>("/api/employees", payload);

      toast.success("Employee created successfully");
      navigate("/dashboard/employees");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h1 className="text-2xl mt-2 font-bold text-gray-800 mb-8">
        Ajouter un Employé
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
                Position*
              </label>
              <input
                type="text"
                name="position"
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

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Column */}
          <div className="space-y-4">
            {/* Address Group */}
            <div className="space-y-4 p-4 border border-gray-100 rounded-lg bg-gray-50">
              <h3 className="font-medium text-gray-700 flex items-center gap-2">
                <BiMap className="text-[var(--color-yousra)]" />
                Adresse
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <div className="relative">
                  <FaCity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    onChange={handleSelectWilaya}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-yousra)] focus:border-transparent"
                    name="ville"
                    required
                    value={employee.ville}
                  >
                    <option value="">Sélectionner une ville</option>
                    {codesPostauxAlgerie?.map((element, index) => (
                      <option value={element.wilaya} key={index}>
                        {element.wilaya}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <MdOutlineMap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    onChange={handleSelect}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-yousra)] focus:border-transparent"
                    name="région"
                    required
                    value={employee.région}
                  >
                    <option value="">Sélectionner une région</option>
                    {state?.map((element, index) => (
                      <option value={element} key={index}>
                        {element}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <FaMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    onChange={handleSelect}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-yousra)] focus:border-transparent"
                    name="code_postal"
                    required
                    value={employee.code_postal}
                  >
                    <option value="">Sélectionner un code postal</option>
                    {codesPostauxAlgerie?.map((element, index) => (
                      <option value={element.codePostal} key={index}>
                        {element.codePostal}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <BiMap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    name="street"
                    type="text"
                    value={employee.street}
                    onChange={ChangeHandler}
                    placeholder="Nom de la rue"
                    required
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-yousra)] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Second Column */}
          <div className="space-y-4">
            {/* Contract Information */}
            <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
              <h3 className="font-medium text-gray-700 flex items-center gap-2 mb-4">
                <svg
                  className="w-5 h-5 text-[var(--color-yousra)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  ></path>
                </svg>
                Contrat
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type de contrat*
                  </label>
                  <select
                    name="contractTypeId"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-yousra)] focus:border-transparent"
                    onChange={handleContractChange}
                    value={employee.contractTypeId}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de naissance*
                  </label>
                  <input
                    type="date"
                    name="date_naissance"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-yousra)] focus:border-transparent"
                    onChange={ChangeHandler}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de début*
                  </label>
                  <input
                    type="date"
                    name="date_début"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-yousra)] focus:border-transparent"
                    onChange={ChangeHandler}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="px-6 pb-6 flex items-center justify-between">
          <div>
            <Link to={"/dashboard/employees"}>
              <button className="w-full md:w-auto px-6 py-3 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-yousra)] focus:ring-offset-2 transition-colors flex items-center justify-center">
                Annuler
              </button>
            </Link>
          </div>

          <div>
            <button
              className="w-full md:w-auto px-6 py-3 bg-[var(--color-yousra)] text-white font-medium rounded-lg shadow hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-yousra)] focus:ring-offset-2 transition-colors flex items-center justify-center"
              onClick={handelSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
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
                </>
              ) : (
                "Ajouter l'employé"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
