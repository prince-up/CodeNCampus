import { request } from './api';
import {
  AuthSessionDTO,
  UserRole,
  PasswordResetRequestDTO,
  PasswordResetConfirmDTO,
  PublicSchoolBrandingDTO,
} from '@codencampus/types';

export async function fetchSchoolBrandingApi(identifier: string): Promise<PublicSchoolBrandingDTO> {
  return request<PublicSchoolBrandingDTO>(`/api/v1/schools/branding/${encodeURIComponent(identifier)}`, {
    method: 'GET',
  });
}

export interface LoginParams {
  identifier: string;
  password: string;
  schoolId?: string;
}

export async function loginApi(params: LoginParams): Promise<AuthSessionDTO> {
  return request<AuthSessionDTO>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function getMeApi(token: string, schoolId?: string): Promise<AuthSessionDTO> {
  return request<AuthSessionDTO>('/api/v1/auth/me', {
    method: 'GET',
    token,
    schoolId,
  });
}

export async function switchRoleApi(
  token: string,
  targetRole: UserRole,
  targetSchoolId?: string
): Promise<AuthSessionDTO> {
  return request<AuthSessionDTO>('/api/v1/auth/switch-role', {
    method: 'POST',
    token,
    body: JSON.stringify({ targetRole, targetSchoolId }),
  });
}

export async function logoutApi(token: string): Promise<{ success: boolean }> {
  try {
    return await request<{ success: boolean }>('/api/v1/auth/logout', {
      method: 'POST',
      token,
    });
  } catch {
    // Stateless logout proceeds even if network fails
    return { success: true };
  }
}

export async function requestPasswordResetApi(
  params: PasswordResetRequestDTO
): Promise<{ message: string }> {
  return request<{ message: string }>('/api/v1/auth/password-reset/request', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function confirmPasswordResetApi(
  params: PasswordResetConfirmDTO
): Promise<{ message: string }> {
  return request<{ message: string }>('/api/v1/auth/password-reset/confirm', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

