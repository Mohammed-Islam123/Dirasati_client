import { useState, useEffect } from "react";
import { Search, Filter, MoreVertical, Edit, Trash } from "lucide-react";
import {
  getLevels,
  getSpecializations,
  Levels,
  Specializations,
} from "../../apis/levels.api";
import {
  createClassroom,
  deleteClassroom,
  updateClassroom,
} from "../../hooks/useClassRoom";
import { Classroom, getClassrooms } from "../../apis/classroom.api";
import toast from "react-hot-toast";
import { CreateClassroomRequest } from "../../types/types";

const ClassroomList = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([
    {
      classroomId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      className: "Mathematics 101",
      schoolLevelId: 1,
      specializationId: 101,
      levelName: "Beginner",
      specializationName: "Mathematics",
      schoolType: "Public",
    },
    {
      classroomId: "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
      className: "Physics Advanced",
      schoolLevelId: 2,
      specializationId: 202,
      levelName: "Advanced",
      specializationName: "Physics",
      schoolType: "Private",
    },
    {
      classroomId: "9z8y7x6w-5v4u-3t2s-1r0q-p9o8n7m6l5k4",
      className: "Chemistry Basics",
      schoolLevelId: 1,
      specializationId: 303,
      levelName: "Beginner",
      specializationName: "Chemistry",
      schoolType: "Charter",
    },
    {
      classroomId: "abcd1234-ef56-gh78-ij90-klmn1234opqr",
      className: "English Literature",
      schoolLevelId: 3,
      specializationId: 404,
      levelName: "Intermediate",
      specializationName: "English",
      schoolType: "Public",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(
    null
  );
  const [levels, setLevel] = useState<Levels[]>([]);
  const [specialization, setSpecialization] = useState<Specializations[]>([]);

  const [newClass, setNewClass] = useState<CreateClassroomRequest>({
    className: "",
    schoolLevelId: 0,
    specializationId: undefined,
  });

  // get Levels and Specializations
  useEffect(() => {
    const fetchLevels = async () => {
      const data = await getLevels();
      setLevel(data);
    };
    fetchLevels();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSpecializations();
      setSpecialization(data);
    };
    if (Number(localStorage.getItem("shool")) === 3) {
      fetchData();
    }
  }, []);

  // Menu state
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    schoolType: "",
    levelName: "",
  });
  const [filteredClassrooms, setFilteredClassrooms] =
    useState<Classroom[]>(classrooms);

  // Apply search and filters
  useEffect(() => {
    let result = classrooms;

    // Apply search
    if (searchTerm) {
      result = result.filter(
        (classroom) =>
          classroom.className
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          classroom.specializationName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.schoolType) {
      result = result.filter(
        (classroom) => classroom.schoolType === filters.schoolType
      );
    }

    if (filters.levelName) {
      result = result.filter(
        (classroom) => classroom.levelName === filters.levelName
      );
    }

    setFilteredClassrooms(result);
  }, [searchTerm, filters, classrooms]);

  const fetchData = async () => {
    try {
      const data: Classroom[] | string = await getClassrooms(); // ✅ use await here
      if (typeof data !== "string") {
        setClassrooms(data);
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message, { position: "top-right" });
      } else {
        toast.error("An unknown error occurred", { position: "top-right" });
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // Get unique values for filter options
  const schoolTypes = [...new Set(classrooms.map((item) => item.schoolType))];
  const levelNames = [...new Set(classrooms.map((item) => item.levelName))];

  const handleAddClassroom = async () => {
    if (isEditMode && selectedClassroom) {
      await updateClassroom(selectedClassroom.classroomId, {
        className: newClass.className,
        schoolLevelId: newClass.schoolLevelId,
        specializationId: newClass.specializationId,
      });
      toast.success(`Class updated successfully`, { position: "bottom-right" });
    } else {
      // Add new classroom
      await createClassroom(newClass);
    }

    await fetchData(); // Refresh the classroom list
    closeDialog();
  };

  const handleEditClassroom = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setNewClass({
      className: classroom.className,
      schoolLevelId: classroom.schoolLevelId,
      specializationId: classroom.specializationId,
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
    setOpenMenuId(null);
  };

  const handleDeleteClassroom = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setIsDeleteDialogOpen(true);
    setOpenMenuId(null);
  };

  const confirmDelete = async () => {
    if (selectedClassroom) {
      setClassrooms(
        classrooms.filter(
          (c) => c.classroomId !== selectedClassroom.classroomId
        )
      );
      setIsDeleteDialogOpen(false);
      setSelectedClassroom(null);
      deleteClassroom(selectedClassroom.classroomId);
      console.log("Classroom deleted:", selectedClassroom.classroomId);
      toast.success("Classroom deleted successfully", {
        position: "bottom-right",
      });
    }
  };

  const resetFilters = () => {
    setFilters({
      schoolType: "",
      levelName: "",
    });
    setIsFilterOpen(false);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setSelectedClassroom(null);
    setNewClass({
      className: "",
      schoolLevelId: 0,
      specializationId: undefined,
    });
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className={`p-8 bg-sous min-h-screen `}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Classrooms</h1>
        <button
          onClick={() => {
            setIsEditMode(false);
            setIsDialogOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full shadow-md transition"
        >
          Add Classroom
        </button>
      </div>

      {/* Search and filter bar */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search classrooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <Filter className="h-5 w-5 text-gray-500" />
            <span>Filter</span>
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 p-4 border border-gray-200">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Type
                </label>
                <select
                  value={filters.schoolType}
                  onChange={(e) =>
                    setFilters({ ...filters, schoolType: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">All Types</option>
                  {schoolTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level
                </label>
                <select
                  value={filters.levelName}
                  onChange={(e) =>
                    setFilters({ ...filters, levelName: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">All Levels</option>
                  {levelNames.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800 transition"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Empty state */}
      {filteredClassrooms.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            No classrooms found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
        </div>
      )}

      {/* Classroom grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredClassrooms.map((classroom) => (
          <div
            key={classroom.classroomId}
            className="bg-white rounded-xl cursor-pointer shadow-sm hover:shadow-md p-6 transform transition hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {classroom.className}
              </h2>
              <div className="relative">
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    classroom.schoolLevelId === 10
                      ? "bg-green-100 text-green-700"
                      : classroom.schoolLevelId === 11
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {classroom.schoolType}
                </span>
                <button
                  onClick={() => toggleMenu(classroom.classroomId)}
                  className="ml-2 p-1 rounded-full hover:bg-gray-100 transition"
                >
                  <MoreVertical className="h-4 w-4 text-gray-500" />
                </button>

                {/* Dropdown menu */}
                {openMenuId === classroom.classroomId && (
                  <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg z-10 py-1 border border-gray-200">
                    <button
                      onClick={() => handleEditClassroom(classroom)}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClassroom(classroom)}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="text-gray-600 space-y-2">
              <div>
                <span className="text-gray-500 text-sm">Level:</span>
                <span className="ml-1 font-medium">{classroom.levelName}</span>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Specialization:</span>
                <span className="ml-1 font-medium">
                  {classroom.specializationName}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-4 truncate">
                <span>ID:</span> {classroom.classroomId}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Classroom Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/25 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-4 my-8 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
              {isEditMode ? "Edit Classroom" : "Add New Classroom"}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Class Name"
                value={newClass.className}
                onChange={(e) =>
                  setNewClass({ ...newClass, className: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <select
                value={newClass.schoolLevelId || ""}
                onChange={(e) =>
                  setNewClass({
                    ...newClass,
                    schoolLevelId: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {/* Default option */}
                <option value="" disabled>
                  Select level...
                </option>

                {/* Dynamic options */}
                {levels.map((level) => (
                  <option key={level.levelId} value={level.levelId}>
                    {level.levelYear} {level.levelYear === 1 ? "ère" : "ème"}
                  </option>
                ))}
              </select>

              {localStorage.getItem("shool") === "3" && (
                <select
                  value={newClass.specializationId || ""}
                  onChange={(e) =>
                    setNewClass({
                      ...newClass,
                      specializationId: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                    !newClass.schoolLevelId
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={!newClass.schoolLevelId}
                >
                  {/* Default option */}
                  <option value="" disabled>
                    Select specialization...
                  </option>

                  {/* Dynamic options */}
                  {(newClass.schoolLevelId === 10
                    ? specialization.slice(0, 2)
                    : specialization.slice(2)
                  ).map((spec) => (
                    <option
                      key={spec.specializationId}
                      value={spec.specializationId}
                    >
                      {spec.name}
                    </option>
                  ))}
                </select>
              )}

              {/* School Type dropdown stays the same as it's not part of the DTO but used in UI */}
              <select
                value={selectedClassroom?.schoolType || "Public"}
                onChange={(e) =>
                  setSelectedClassroom((prev) =>
                    prev ? { ...prev, schoolType: e.target.value } : null
                  )
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
                <option value="Charter">Charter</option>
              </select>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={closeDialog}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddClassroom}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                {isEditMode ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && selectedClassroom && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/25 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-4 my-8 animate-fade-in">
            <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
              Delete Classroom
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to delete "{selectedClassroom.className}"?
              This action cannot be undone.
            </p>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassroomList;
