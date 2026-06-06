import { Timestamp } from 'firebase/firestore';

export interface AdminConfig {
  username: string;
  password: string;
}

export interface SupportConfig {
  complaintsPhone: string;
}

export interface Location {
  name: string;
  type: 'city' | 'village';
  createdAt?: Timestamp | Date;
}

export interface User {
  fullName: string;
  email?: string;
  phone?: string;
  role: 'driver' | 'client' | 'admin';
  isVerified: boolean;
  verificationCode?: string;
  createdAt?: Timestamp | Date;
  rating?: number;
  totalRatings?: number;
  documents?: string;
}

export interface Request {
  clientId: string;
  clientName: string;
  clientDetails?: string;
  pickup: string;
  destination: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  driverId?: string;
  isRated?: boolean;
  createdAt?: Timestamp | Date;
}

export interface Rating {
  driverId: string;
  clientId: string;
  requestId: string;
  score: number;
  comment?: string;
  createdAt?: Timestamp | Date;
}

export interface Notification {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
  userId: string;
  createdAt?: Timestamp | Date;
}