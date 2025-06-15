"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Calendar,
  GraduationCap,
  MapPin,
  Phone,
  User,
  Users,
  Search,
  Edit,
  Trash2,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { calculateAge, formatDate } from "../../utils/timePack";
import {
  deleteGroup,
  GetStudentGroup,
  getStudentsByGroup,
  GroupResponse,
  Student,
  updateGroup,
} from "../../apis/group.api";
import { bgColor200Array } from "../../constants/colors";

interface GroupDetails {
  groupId: string;
  groupName: string;
  groupCapacity: number;
  studentCount: number;
  levelId: string;
  level: {
    specialization: string;
    schoolType: string;
    year: number;
  };
  students: Student[];
  createdDate: string;
  isActive: boolean;
}

export const GroupDetails = () => {
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("id");
  const [studentGroup, setStudentGroup] = useState<GroupResponse | null>(null);
  const [groupData, setGroupData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    groupName: "",
    groupCapacity: 0,
  });

  useEffect(() => {
    const fetchGroupData = async () => {
      if (!groupId) {
        setLoading(false);
        return;
      }

      try {
        const data = await getStudentsByGroup(groupId);
        if (typeof data !== "string") {
          setGroupData(data);
        }
      } catch (error) {
        console.error("Error fetching group details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroupData();
  }, [groupId]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  // Fixed: groupData is already an array of students, no need to access .students
  const filteredStudents = groupData.filter(
    (student) =>
      `${student.firstName} ${student.lastName}`
        .toLowerCase()
        .includes(studentSearchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(studentSearchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await GetStudentGroup();
        if (data) {
          if (groupId) {
            const groupSelected = data.find(
              (group) => group.groupId === groupId
            );
            setStudentGroup(groupSelected || null);
          } else {
            setStudentGroup(null);
          }
        } else {
          setStudentGroup(null);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
        setStudentGroup(null);
      }
    };

    fetchGroups();
  }, [groupId]);

  const handleEditGroup = () => {
    // Initialize edit form with current group data
    if (studentGroup) {
      setEditFormData({
        groupName: studentGroup.groupName,
        groupCapacity: studentGroup.groupCapacity,
      });
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = async () => {
    try {
      console.log("Save group edits:", { groupId, ...editFormData });
      if (groupId) {
        await updateGroup(groupId, {
          groupName: editFormData.groupName,
          groupCapacity: editFormData.groupCapacity,
          studentIds: [],
        });
      }

      if (studentGroup) {
        setStudentGroup({
          ...studentGroup,
          groupName: editFormData.groupName,
          groupCapacity: editFormData.groupCapacity,
        });
      }

      setShowEditModal(false);
      // Show success message
    } catch (error) {
      console.error("Error updating group:", error);
      // Handle error (show toast, etc.)
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await deleteGroup(groupId || "");
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting group:", error);
      // Handle error (show toast, etc.)
    } finally {
      // Optionally, redirect or refresh the page after deletion
      window.location.href = "/dashboard/gestion";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading group details...</p>
        </div>
      </div>
    );
  }

  // Fixed: Check if groupData array is empty instead of null
  if (!groupData || groupData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h1 className="text-3xl font-bold mb-4">Group Not Found</h1>
        <p className="text-gray-600">
          We couldn't find any students in this group.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-5">
      {studentGroup && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-blue-600" />
                <h4 className="text-xl font-semibold text-blue-800">
                  {studentGroup.groupName}
                </h4>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEditGroup}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Edit className="h-4 w-4" />
                  Edit Group
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Group
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Specialization:</span>
                <span className="text-sm">
                  {studentGroup.level?.specialization || "N/A"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">School Type:</span>
                <span className="text-sm">
                  {studentGroup.level?.schoolType || "N/A"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Year:</span>
                <span className="text-sm">
                  Year {studentGroup.level?.year || "N/A"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Group Capacity:</span>
                <span className="text-sm">
                  {studentGroup.groupCapacity} students
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Current Students:</span>
                <span className="text-sm">
                  {studentGroup.studentCount} students
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Level ID:</span>
                <span className="text-sm">{studentGroup.levelId}</span>
              </div>
            </div>

            {/* Progress bar for group capacity */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Group Occupancy</span>
                <span>
                  {studentGroup.studentCount}/{studentGroup.groupCapacity}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      studentGroup.groupCapacity > 0
                        ? (studentGroup.studentCount /
                            studentGroup.groupCapacity) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 rounded-lg border border-blue-200 shadow-sm">
        <div className="p-6">
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students by name or email..."
                value={studentSearchTerm}
                onChange={(e) => setStudentSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student, index) => (
                <div
                  key={student.studentId}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`h-12 w-12 rounded-full ${bgColor200Array[index]} flex items-center justify-center`}
                    >
                      {student.photoUrl ? (
                        <img
                          src={student.photoUrl}
                          alt={`${student.firstName} ${student.lastName}`}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <span
                          className={`${bgColor200Array[index]} font-medium`}
                        >
                          {getInitials(student.firstName, student.lastName)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">
                        {student.firstName} {student.lastName}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">
                        {student.email || "No email provided"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-gray-400" />
                      <span>Age: {calculateAge(student.birthDate)} years</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span>
                        Enrolled: {formatDate(student.enrollmentDate)}
                      </span>
                    </div>

                    {student.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span>{student.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex gap-2"></div>
                    <Link
                      to={`/dashboard/Eleves?tab=student-details&id=${student.studentId}&color=bg-green-200`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {studentSearchTerm
                    ? "No students match your search"
                    : "No students in this group"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 backdrop-blur-md shadow-2xl border-2  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold">Delete Group</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this group? This action cannot be
              undone. All students will be removed from the group.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGroup}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Group Modal */}
      {showEditModal && (
        <div className="fixed inset-0 backdrop-blur-xs  border-2 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Edit className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">Edit Group</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="groupName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Group Name
                </label>
                <input
                  type="text"
                  id="groupName"
                  value={editFormData.groupName}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      groupName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter group name"
                />
              </div>

              <div>
                <label
                  htmlFor="groupCapacity"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Group Capacity
                </label>
                <input
                  type="number"
                  id="groupCapacity"
                  min="1"
                  value={editFormData.groupCapacity}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      groupCapacity: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter capacity"
                />
                {studentGroup &&
                  editFormData.groupCapacity < studentGroup.studentCount && (
                    <p className="text-red-600 text-sm mt-1">
                      Warning: Capacity cannot be less than current student
                      count ({studentGroup.studentCount})
                    </p>
                  )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={
                  !!(
                    !editFormData.groupName.trim() ||
                    editFormData.groupCapacity < 1 ||
                    (studentGroup &&
                      editFormData.groupCapacity < studentGroup.studentCount)
                  )
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
