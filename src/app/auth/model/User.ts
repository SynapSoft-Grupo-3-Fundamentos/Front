export interface User {
  id: number;
  fullName: string;
  email: string;
  document: string;
  password: string;
  phone: string;
  profileImg: string;
  role: UserRole;
}

export type UserRole = 'tutor' | 'caregiver';
