import Profile from "../../components/ui/profile";
import Image1 from "../../assets/images/image copy 2.png";
import { BiPlus } from "react-icons/bi";
import { LuPhone } from "react-icons/lu";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaLink } from "react-icons/fa6";
import { FaCity } from "react-icons/fa";
import { MdOutlineMap } from "react-icons/md";
import { FaMapPin } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import uploadFileToCloudinary from "../../config/UploadCloudinary";
import { codesPostauxAlgerie } from "../../constants/codePostaux";
import requests from "../../apis/agent";

interface Spécialité {
  specializationId: number;
  name: string;
}

interface Phone {
  number: string;
}

interface School {
  name: string;
  email: string;
  logo: string;
  websiteUrl: string;
  startDate: string;
  endDate: string;
  phoneNumbers: Phone[];
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  specializations: number[];
}

interface School1 {
  schoolId: string;
  name: string;
  email: string;
  logo: string;
  websiteUrl: string;
  schoolConfig: string;
  academicYear: {
    startDate: string;
    endDate: string;
  };
  phoneNumbers: Phone[];
  schoolType: {
    schoolTypeId: number;
    name: string;
  };
  specializations: number[];
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

const Etablisment = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [, setErr] = useState<string>("");
  const [state, setState] = useState<string[]>([]);
  const [wilaya, setWilaya] = useState<string>("Oran");
  const [, setSpe] = useState<Spécialité[]>([]);
  const [selectedSpe, setSelectedSpe] = useState<number[]>([]);
  const [fileText, setFileText] = useState("");
  const [permitted, setPermitted] = useState<boolean>(false);
  const [showSchool, setShowSchool] = useState<School1>({
    schoolId: "",
    name: "",
    email: "",
    logo: "",
    websiteUrl: "",
    schoolConfig: "",
    academicYear: {
      startDate: "",
      endDate: "",
    },
    phoneNumbers: [{ number: "" }],
    schoolType: {
      schoolTypeId: 0,
      name: "",
    },
    specializations: [],
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });
  const [editSchool, setEditSchool] = useState<School>({
    name: "",
    email: "",
    logo: "",
    websiteUrl: "",
    startDate: "",
    endDate: "",
    phoneNumbers: [{ number: "" }],
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Algeria",
    specializations: [],
  });

  const navigate = useNavigate();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileURL = await uploadFileToCloudinary(file, "raw");
      if (fileURL) {
        setEditSchool((prev) => ({ ...prev, logo: fileURL }));
        setFileText("Image uploaded successfully");
      }
    }
  };

  const handleSelectWilaya = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedWilaya = e.target.value;
    setWilaya(selectedWilaya);
    setEditSchool((prev) => ({
      ...prev,
      city: selectedWilaya,
      state: "",
      postalCode:
        codesPostauxAlgerie.find((w) => w.wilaya === selectedWilaya)
          ?.codePostal || "",
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditSchool((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditSchool((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneNumberAdd = () => {
    if (editSchool.phoneNumbers.length < 3) {
      setEditSchool((prev) => ({
        ...prev,
        phoneNumbers: [...prev.phoneNumbers, { number: "" }],
      }));
    }
  };

  const handleNumTel = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPhoneNumbers = [...editSchool.phoneNumbers];
    newPhoneNumbers[index] = { number: e.target.value };
    setEditSchool((prev) => ({ ...prev, phoneNumbers: newPhoneNumbers }));
  };

  useEffect(() => {
    const selectedWilaya = codesPostauxAlgerie.find(
      (el) => el.wilaya === wilaya
    );
    setState(selectedWilaya ? selectedWilaya.regions : []);
  }, [wilaya]);

  useEffect(() => {
    const fetchSchoolInfos = async () => {
      setLoading(true);
      try {
        const [schoolData, specializationsData] = await Promise.all([
          requests.get<School1>("/api/School"),
          requests.get<Spécialité[]>("/api/Levels/specializations"),
        ]);

        setShowSchool(schoolData);
        setEditSchool({
          name: schoolData.name,
          email: schoolData.email,
          logo: schoolData.logo,
          websiteUrl: schoolData.websiteUrl,
          startDate: schoolData.academicYear?.startDate || "",
          endDate: schoolData.academicYear?.endDate || "",
          phoneNumbers: schoolData.phoneNumbers || [{ number: "" }],
          street: schoolData.address.street,
          city: schoolData.address.city,
          state: schoolData.address.state,
          postalCode: schoolData.address.postalCode,
          country: schoolData.address.country || "Algeria",
          specializations: [],
        });

        setSpe(specializationsData);
        setWilaya(schoolData.address.city || "Oran");
        setSelectedSpe(schoolData.specializations || []);
      } catch (err) {
        setErr(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchSchoolInfos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare the request body
      const body = {
        name: editSchool.name || showSchool.name,
        email: editSchool.email || showSchool.email,
        logo: editSchool.logo || showSchool.logo,
        websiteUrl: editSchool.websiteUrl || showSchool.websiteUrl,
        phoneNumbers: editSchool.phoneNumbers
          .filter((phone) => phone.number.trim() !== "")
          .map((phone) => ({ number: phone.number })),
        address: {
          street: editSchool.street || showSchool.address.street,
          city: editSchool.city || showSchool.address.city,
          state: editSchool.state || showSchool.address.state,
          postalCode: editSchool.postalCode || showSchool.address.postalCode,
          country:
            editSchool.country || showSchool.address.country || "Algeria",
        },
        specializations:
          selectedSpe.length > 0
            ? selectedSpe
            : showSchool.specializations || [],
        academicYear: {
          startDate: editSchool.startDate || showSchool.academicYear?.startDate,
          endDate: editSchool.endDate || showSchool.academicYear?.endDate,
        },
      };

      console.log(body);

      const updatedSchool = await requests.put<School1>("/api/School", body);
      setShowSchool(updatedSchool);
      setPermitted(false);
      toast.success("School updated successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setPermitted(!permitted);
    if (!permitted) {
      // When entering edit mode, initialize with current data
      setEditSchool({
        name: showSchool.name,
        email: showSchool.email,
        logo: showSchool.logo,
        websiteUrl: showSchool.websiteUrl,
        startDate: showSchool.academicYear?.startDate || "",
        endDate: showSchool.academicYear?.endDate || "",
        phoneNumbers: showSchool.phoneNumbers || [{ number: "" }],
        street: showSchool.address.street,
        city: showSchool.address.city,
        state: showSchool.address.state,
        postalCode: showSchool.address.postalCode,
        country: showSchool.address.country || "Algeria",
        specializations: showSchool.specializations || [],
      });
      setWilaya(showSchool.address.city || "Oran");
      setSelectedSpe(showSchool.specializations || []);
    }
  };

  return (
    <div className="w-[90%] max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-yousra]">
          Information d'établissement
        </h1>
        <Profile />
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-[var(--color-yousra)] px-6 py-4">
          <h2 className="text-xl font-semibold text-white">
            Profil de l'établissement
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Photo Section */}
          <div className="flex items-start mb-8">
            {permitted ? (
              <div className="w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo*
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center">
                  <input
                    type="file"
                    id="photo"
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
            ) : (
              <div className="rounded-full w-32 h-32 overflow-hidden border-2 border-gray-200 shadow-sm">
                <img
                  src={showSchool.logo || Image1}
                  alt="School Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = Image1;
                  }}
                />
              </div>
            )}
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-4">
              {/* School Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom d'établissement*
                </label>
                {permitted ? (
                  <input
                    type="text"
                    value={editSchool.name}
                    name="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-[var(--color-yousra)] 
                             focus:border-[var(--color-yousra)]"
                    onChange={handleChange}
                  />
                ) : (
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    {showSchool.name}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email d'établissement*
                </label>
                <div className="relative">
                  <MdOutlineMailOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  {permitted ? (
                    <input
                      type="email"
                      value={editSchool.email}
                      name="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-[var(--color-yousra)] 
                             focus:border-[var(--color-yousra)]"
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                      {showSchool.email}
                    </div>
                  )}
                </div>
              </div>

              {/* Academic Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Année Scolaire*
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {permitted ? (
                    <>
                      <div>
                        <input
                          type="date"
                          name="startDate"
                          value={editSchool.startDate}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-[var(--color-yousra)] 
                             focus:border-[var(--color-yousra)]"
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <input
                          type="date"
                          name="endDate"
                          value={editSchool.endDate}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-[var(--color-yousra)] 
                             focus:border-[var(--color-yousra)]"
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                          {showSchool.academicYear?.startDate || "N/A"}
                        </div>
                      </div>
                      <div>
                        <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                          {showSchool.academicYear?.endDate || "N/A"}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Phone Numbers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéros de téléphone
                </label>
                <div className="space-y-2">
                  {(permitted
                    ? editSchool.phoneNumbers
                    : showSchool.phoneNumbers
                  ).map((phone, index) => (
                    <div key={index} className="relative">
                      <LuPhone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      {permitted ? (
                        <input
                          type="text"
                          value={phone.number}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border[var(--color-yousra)]"
                          onChange={(e) => handleNumTel(index, e)}
                        />
                      ) : (
                        <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                          {phone.number}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {permitted && editSchool.phoneNumbers.length < 3 && (
                  <button
                    type="button"
                    className="mt-2 flex items-center gap-1 text-sm text-[var(--color-yousra)] hover:text-[var(--color-yousra-dark)]"
                    onClick={handlePhoneNumberAdd}
                  >
                    <BiPlus /> Ajouter un numéro
                  </button>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Address Section */}
              <div className="grid grid-cols-3 gap-4">
                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville
                  </label>
                  <div className="relative">
                    <FaCity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    {permitted ? (
                      <select
                        onChange={handleSelectWilaya}
                        className="w-full px-4 pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-yousra)] focus:border-transparent"
                        name="city"
                        value={editSchool.city}
                      >
                        {codesPostauxAlgerie?.map((element, index) => (
                          <option value={element.wilaya} key={index}>
                            {element.wilaya}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="w-full px-4 pl-10 py-2 border border-gray-300 rounded-lg bg-gray-50">
                        {showSchool.address.city}
                      </div>
                    )}
                  </div>
                </div>

                {/* Region */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Région
                  </label>
                  <div className="relative">
                    <MdOutlineMap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    {permitted ? (
                      <select
                        className="w-full px-4 pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-yousra)] focus:border-transparent"
                        name="state"
                        value={editSchool.state}
                        onChange={handleSelect}
                      >
                        {state?.map((element, index) => (
                          <option value={element} key={index}>
                            {element}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="w-full px-4 pl-10 py-2 border border-gray-300 rounded-lg bg-gray-50">
                        {showSchool.address.state}
                      </div>
                    )}
                  </div>
                </div>

                {/* Postal Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code Postal
                  </label>
                  <div className="relative">
                    <FaMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    {permitted ? (
                      <select
                        className="w-full px-4 pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-yousra)] focus:border-transparent"
                        name="postalCode"
                        value={editSchool.postalCode}
                        onChange={handleSelect}
                      >
                        {codesPostauxAlgerie?.map((element, index) => (
                          <option value={element.codePostal} key={index}>
                            {element.codePostal}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="w-full px-4 pl-10 py-2 border border-gray-300 rounded-lg bg-gray-50">
                        {showSchool.address.postalCode}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Web
                </label>
                <div className="relative">
                  <FaLink className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  {permitted ? (
                    <input
                      type="text"
                      value={editSchool.websiteUrl}
                      name="websiteUrl"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-[var(--color-yousra)] 
                             focus:border-[var(--color-yousra)]"
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                      {showSchool.websiteUrl}
                    </div>
                  )}
                </div>
              </div>

              {/* Street */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <div className="relative">
                  <FiPhone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  {permitted ? (
                    <input
                      type="text"
                      value={editSchool.street}
                      name="street"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-[var(--color-yousra)] 
                             focus:border-[var(--color-yousra)]"
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                      {showSchool.address.street}
                    </div>
                  )}
                </div>
              </div>

              {/* Specializations */}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            {permitted ? (
              <>
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  onClick={() => setPermitted(false)}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="px-6 py-2 bg-[var(--color-yousra)] text-white rounded-lg pointer"
                  onClick={handleSubmit}
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
                      Enregistrement...
                    </span>
                  ) : (
                    "Enregistrer les modifications"
                  )}
                </button>
              </>
            ) : (
              <button
                type="button"
                className="px-6 py-2 bg-[var(--color-yousra)] text-white rounded-lg pointer"
                onClick={handleEditToggle}
              >
                Modifier les informations
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Etablisment;
