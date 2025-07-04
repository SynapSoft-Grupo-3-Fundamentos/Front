export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  document: string;
  password: string;
  profileImg: string;
  address: string;
  district: string;
  role: UserRole;
}

type UserRole = 'tutor' | 'caregiver';
