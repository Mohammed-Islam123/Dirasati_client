export interface RefreshToken {
  refreshToken: string;
  accessToken: string;
}

// Subject related types
export interface Subject {
  subjectId: string;
  name: string;
}

// Contract related types
export interface Contract {
  contractTypeId: number;
  name: string;
}

// Bill related types
export interface Bill {
  billId: string;
  title: string;
  description: string;
  amount: number;
  paymentStatus: string;
  createdAt: string;
}

export interface NewBill {
  title: string;
  description: string;
  amount: number;
  schoolLevelId: number;
}

// Employee related types
export interface EmployeePayload {
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  position: string;
  hireDate: string;
  contractType: string;
  permissions: number;
  isActive: boolean;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}

// Teacher related types
export interface TeacherPayload {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  hireDate: string;
  contractTypeId: number;
  contractType: string;
  subjectIds: number[];
  schoolId: string | null;
  address: {
    fullAddress: string;
  };
}

// Password change payload
export interface PasswordChangePayload {
  oldPassword: string;
  newPassword: string;
}

// Classroom related types
export interface CreateClassroomRequest {
  className: string;
  schoolLevelId: number;
  specializationId?: number;
}

export interface UpdateClassroomRequest {
  className: string;
  schoolLevelId?: number;
  specializationId?: number;
}

export interface Classroom {
  classroomId: string;
  className: string;
  schoolLevelId: number;
  specializationId?: number;
  levelName: string;
  specializationName: string;
  schoolType: string;
}

export interface ClassroomDetail extends Classroom {
  group?: ClassroomGroup;
}

export interface ClassroomGroup {
  groupId: string;
  groupName: string;
  studentCount: number;
  groupCapacity: number;
}
