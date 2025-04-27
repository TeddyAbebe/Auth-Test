export interface User {
  email: string;
  password: string;
}

export interface Employee {
  id: number;
  name: string;
  timezone: string;
  checked_in_at: string | null;
  checked_out_at: string | null;
  checkout_message: string | null;
}

export interface AttendanceDay {
  date: string;
  employees: Employee[];
}

export interface AttendanceData {
  current_day: AttendanceDay;
  yesterday: AttendanceDay;
}

export interface TeamResponse {
  team: {
    id: number;
    name: string;
  };
  attendance_data: AttendanceData;
  status: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword: string;
}
