export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  durationMinutes: number;
  price: number;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Stylist {
  id: string;
  name: string;
  title: string;
  bio: string;
  specialties: string[];
  imageUrl: string;
  yearsExperience: number;
  rating: number;
  isActive: boolean;
  schedule: unknown;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface BookingCustomer {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  stylistId: string;
  stylistName: string;
  date: string;
  time: string;
  durationMinutes: number;
  price: number;
  status: BookingStatus;
  customer: BookingCustomer;
  createdAt: string;
  updatedAt: string;
}

export interface Timeslot {
  time: string;
  available: boolean;
  reason?: string;
}

export interface TimeslotResponse {
  date: string;
  slots: Timeslot[];
}

export interface CreateBookingPayload {
  serviceId: string;
  stylistId: string;
  date: string;
  time: string;
  customer: BookingCustomer;
}
