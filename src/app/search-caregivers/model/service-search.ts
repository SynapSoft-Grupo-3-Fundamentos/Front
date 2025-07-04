import { User } from '../../shared/models/user';

export interface ServiceSearch {
  id: number;
  description: string;
  completeName: string;
  farePerHour: number;
  age: number;
  address: string;
  caregiverExperience: number;
  completedServices: number;
  biography: string;
  profileImage: string;
  districtsScope: string;
  schedules: Schedule[];
}

export interface Schedule {
  id: number;
  weekDay: string;
  startHour: string;
  endHour: string;
}
