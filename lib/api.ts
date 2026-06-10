import type {
  Booking,
  CreateBookingPayload,
  Service,
  Stylist,
  TimeslotResponse,
} from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiFailure {
  success: false;
  error: { code: string; message: string };
}

type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

export class ApiError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new ApiError('NETWORK_ERROR', '無法連線到伺服器，請稍後再試');
  }

  let body: ApiEnvelope<T>;
  try {
    body = (await res.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiError('INVALID_RESPONSE', '伺服器回應格式錯誤');
  }

  if (!body.success) {
    throw new ApiError(
      body.error?.code ?? 'UNKNOWN_ERROR',
      body.error?.message ?? '發生未知錯誤'
    );
  }

  return body.data;
}

export function getServices(): Promise<Service[]> {
  return request<Service[]>('/api/services');
}

export function getStylists(): Promise<Stylist[]> {
  return request<Stylist[]>('/api/stylists');
}

export function getTimeslots(
  stylistId: string,
  date: string,
  serviceId: string
): Promise<TimeslotResponse> {
  const params = new URLSearchParams({ stylistId, date, serviceId });
  return request<TimeslotResponse>(`/api/timeslots?${params.toString()}`);
}

export function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  return request<Booking>('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function lookupBookings(phone: string): Promise<Booking[]> {
  const params = new URLSearchParams({ phone });
  return request<Booking[]>(`/api/bookings/lookup?${params.toString()}`);
}
