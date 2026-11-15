import Constants from 'expo-constants';
import { ApiErrorResponse, ApiSuccessResponse } from '@codencampus/types';

const resolveApiUrl = (): string => {
  const extraUrl = Constants.expoConfig?.extra?.apiUrl;
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  return extraUrl || envUrl || 'http://localhost:4000';
};

export const API_BASE_URL = resolveApiUrl();

interface RequestOptions extends RequestInit {
  token?: string;
  schoolId?: string;
}

export class ApiClientError extends Error {
  statusCode: number;
  errorName: string;
  issues?: unknown[];

  constructor(statusCode: number, message: string, errorName = 'ApiError', issues?: unknown[]) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.errorName = errorName;
    this.issues = issues;
  }
}

export async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, schoolId, headers, ...customConfig } = options;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  if (schoolId) {
    defaultHeaders['x-school-id'] = schoolId;
  }

  const url = `${API_BASE_URL.replace(/\/$/, '')}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...customConfig,
      headers: {
        ...defaultHeaders,
        ...(headers as Record<string, string>),
      },
    });

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      const errData = data as ApiErrorResponse | null;
      throw new ApiClientError(
        response.status,
        errData?.message || `Request failed with status ${response.status}`,
        errData?.error || response.statusText,
        errData?.issues
      );
    }

    if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
      return (data as ApiSuccessResponse<T>).data;
    }

    return data as T;
  } catch (err: unknown) {
    if (err instanceof ApiClientError) {
      throw err;
    }
    const message = err instanceof Error ? err.message : 'Network error: could not connect to server';
    throw new ApiClientError(0, message, 'NetworkError');
  }
}

