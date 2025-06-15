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
  Plus,
  Search,
} from "lucide-react";
import { getStudent, StudentDetails } from "../../apis/students.api";
import { Link, useSearchParams } from "react-router-dom";
import { calculateAge, formatDate } from "../../utils/timePack";
import { schoolLevelMap, specializationMap } from "../../utils/schoolLevels";
import {
  // assignStudentToGroup,
  GetStudentGroup,
  GroupResponse,
} from "../../apis/group.api";

export const StudentProfile = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const color = searchParams.get("color");
  const [studentData, setStudentData] = useState<StudentDetails | null>();
  const [studentGroup, setStudentGroup] = useState<GroupResponse | null>(null);
  const [allGroups, setAllGroups] = useState<GroupResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignmentMessage, setAssignmentMessage] = useState("");
  const [groupSearchTerm, setGroupSearchTerm] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getStudent(id);
        if (!data) {
          setStudentData(null); // No student found
        } else {
          setStudentData(data); // Student found
        }
      } catch (error) {
        console.error("Error fetching student:", error);
        setStudentData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await GetStudentGroup();
        if (data) {
          setAllGroups(data);

          if (studentData?.groupId) {
            const groupSelected = data.find(
              (group) => group.groupId === studentData.groupId
            );
            setStudentGroup(groupSelected || null);
          } else {
            setStudentGroup(null);
          }
        } else {
          setAllGroups([]);
          setStudentGroup(null);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
        setAllGroups([]);
        setStudentGroup(null);
      }
    };

    if (studentData) {
      fetchGroups();
    }
  }, [studentData]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  const handleAssignToGroup = async () => {
    if (!selectedGroupId || !studentData?.studentId) {
      setAssignmentMessage("Please select a group");
      return;
    }

    setAssigning(true);
    setAssignmentMessage("");

    try {
      // const result = await assignStudentToGroup(studentData.studentId, selectedGroupId);

      const updatedStudent = await getStudent(id);
      if (updatedStudent) {
        setStudentData(updatedStudent);
      }

      // Refresh groups data
      const updatedGroups = await GetStudentGroup();
      if (updatedGroups) {
        setAllGroups(updatedGroups);
        const assignedGroup = updatedGroups.find(
          (group) => group.groupId === selectedGroupId
        );
        setStudentGroup(assignedGroup || null);
      }

      setAssignmentMessage("Student successfully assigned to group!");
      setShowAssignForm(false);
      setSelectedGroupId("");
    } catch (error) {
      setAssignmentMessage(`Failed to assign student: ${error}`);
    } finally {
      setAssigning(false);
    }
  };

  const availableGroups = allGroups.filter((group) => {
    const matchesSearch =
      group.groupName.toLowerCase().includes(groupSearchTerm.toLowerCase()) ||
      group.level?.specialization
        ?.toLowerCase()
        .includes(groupSearchTerm.toLowerCase());
    const hasCapacity = group.studentCount < group.groupCapacity;
    const notCurrentGroup = group.groupId !== studentData?.groupId;

    return matchesSearch && hasCapacity && notCurrentGroup;
  });

  if (loading || studentData === undefined) {
    return <div>Loading...</div>;
  }

  if (studentData === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h1 className="text-3xl font-bold mb-4">Student Not Found</h1>
        <p className="text-gray-600">
          We couldn't find a student with that ID.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-5">
      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Column - Student Info */}
        <div className="rounded-lg border shadow-sm md:col-span-1">
          <div className="flex flex-col items-center p-6 text-center">
            {/* Avatar */}
            <div className="relative h-24 w-24 overflow-hidden rounded-full">
              {studentData.photoUrl ? (
                <img
                  src={studentData.photoUrl || "/placeholder.svg"}
                  alt={`${studentData.firstName} ${studentData.lastName}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className={`flex h-full w-full items-center justify-center ${color} text-lg font-medium`}
                >
                  {getInitials(studentData?.firstName, studentData.lastName)}
                </div>
              )}
            </div>
            <h2 className="mt-4 text-xl font-bold">{`${studentData.firstName} ${studentData.lastName}`}</h2>
            <p className="text-sm text-gray-500">
              Student ID: {studentData.studentId.substring(0, 8)}
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <span className="rounded-full border bg-blue-50 px-2.5 py-0.5 text-xs font-semibold">
                {specializationMap[studentData.specializationId] ||
                  `Specialization ${studentData.specializationId}`}
              </span>
              <span className="rounded-full border bg-green-50 px-2.5 py-0.5 text-xs font-semibold">
                {schoolLevelMap[studentData.schoolLevelId] ||
                  `Level ${studentData.schoolLevelId}`}
              </span>
              {studentData.isActive && (
                <span className="rounded-full border bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  Active
                </span>
              )}
            </div>
          </div>
          <div className="space-y-4 p-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Address: {studentData.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                Birth: {formatDate(studentData.birthDate)} (
                {calculateAge(studentData.birthDate)} years)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                Birth Place: {studentData.birthPlace}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                Emergency Contact: {studentData.emergencyContact}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                Enrollment Date: {formatDate(studentData.enrollmentDate)}
              </span>
            </div>
            <hr className="my-4 border-t border-gray-200" />
            <div className="space-y-2">
              <h4 className="text-sm font-medium">School Information</h4>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">School ID:</span>
                <span className="text-sm">
                  {studentData.schoolId.substring(0, 8)}...
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Parent ID:</span>
                <span className="text-sm">
                  {studentData.parentId.substring(0, 8)}...
                </span>
              </div>
              {studentData.groupId && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Group ID:</span>
                  <span className="text-sm">
                    {studentData.groupId.substring(0, 8)}...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white shadow-sm md:col-span-2">
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Group Information</h3>
                </div>

                {/* Assignment Message */}
                {assignmentMessage && (
                  <div
                    className={`mb-4 p-3 rounded-lg ${
                      assignmentMessage.includes("successfully")
                        ? "bg-green-50 border border-green-200 text-green-800"
                        : "bg-red-50 border border-red-200 text-red-800"
                    }`}
                  >
                    {assignmentMessage}
                  </div>
                )}

                {/* Group Assignment Form */}
                {showAssignForm && !studentGroup && (
                  <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="text-md font-semibold mb-4">
                      Assign Student to Group
                    </h4>

                    {/* Search Groups */}
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search groups by name or specialization..."
                        value={groupSearchTerm}
                        onChange={(e) => setGroupSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Group Selection */}
                    <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                      {availableGroups.length > 0 ? (
                        availableGroups.map((group) => (
                          <div
                            key={group.groupId}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedGroupId === group.groupId
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => setSelectedGroupId(group.groupId)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium">
                                  {group.groupName}
                                </h5>
                                <p className="text-sm text-gray-600">
                                  {group.level?.specialization} - Year{" "}
                                  {group.level?.year}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">
                                  {group.studentCount}/{group.groupCapacity}
                                </p>
                                <p className="text-xs text-gray-500">
                                  students
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">
                          {groupSearchTerm
                            ? "No groups match your search"
                            : "No available groups with capacity"}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleAssignToGroup}
                        disabled={!selectedGroupId || assigning}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {assigning ? "Assigning..." : "Assign Student"}
                      </button>
                      <button
                        onClick={() => {
                          setShowAssignForm(false);
                          setSelectedGroupId("");
                          setAssignmentMessage("");
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Existing Group Display */}
                {studentGroup ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Users className="h-6 w-6 text-blue-600" />
                        <h4 className="text-xl font-semibold text-blue-800">
                          {studentGroup.groupName}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">
                            Specialization:
                          </span>
                          <span className="text-sm">
                            {studentGroup.level?.specialization || "N/A"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">
                            School Type:
                          </span>
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
                          <span className="text-sm font-medium">
                            Group Capacity:
                          </span>
                          <span className="text-sm">
                            {studentGroup.groupCapacity} students
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">
                            Current Students:
                          </span>
                          <span className="text-sm">
                            {studentGroup.studentCount} students
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Level ID:</span>
                          <span className="text-sm">
                            {studentGroup.levelId}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar for group capacity */}
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">Group Occupancy</span>
                          <span>
                            {studentGroup.studentCount}/
                            {studentGroup.groupCapacity}
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
                        <Link
                          to={`/dashboard/gestion?tab=group-details&id=${studentGroup.groupId}`}
                          className="mt-4"
                        >
                          <button className="bg-blue-600 mt-5 text-white px-4 py-2 rounded-lg w-full shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200">
                            See group details
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  !showAssignForm && (
                    <div className="text-center p-8 bg-gray-50 rounded-lg">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        {studentData.groupId
                          ? "Group information not found"
                          : "Student is not assigned to any group"}
                      </p>
                      <button
                        onClick={() => setShowAssignForm(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 mx-auto"
                      >
                        <Plus className="h-4 w-4" />
                        Assign to Group
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
