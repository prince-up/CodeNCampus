import { request } from './api';
import {
  StudentDetailDTO,
  CreateStudentDTO,
  UpdateStudentDTO,
  StudentSearchQueryDTO,
  ClassDTO,
  CreateClassDTO,
  CreateSectionDTO,
  SectionDTO,
  StudentImportRowDTO,
  StudentImportResultDTO,
} from '@codencampus/types';

export async function fetchStudentsApi(
  token: string,
  schoolId: string,
  query: StudentSearchQueryDTO = {}
): Promise<{ students: StudentDetailDTO[]; total: number; page: number; limit: number }> {
  const params = new URLSearchParams();
  if (query.query) params.append('query', query.query);
  if (query.classId) params.append('classId', query.classId);
  if (query.sectionId) params.append('sectionId', query.sectionId);
  if (query.status) params.append('status', query.status);
  if (query.page) params.append('page', String(query.page));
  if (query.limit) params.append('limit', String(query.limit));

  const qs = params.toString();
  return request<{ students: StudentDetailDTO[]; total: number; page: number; limit: number }>(
    `/api/v1/students${qs ? `?${qs}` : ''}`,
    {
      method: 'GET',
      token,
      schoolId,
    }
  );
}

export async function createStudentApi(
  token: string,
  schoolId: string,
  data: CreateStudentDTO
): Promise<StudentDetailDTO> {
  return request<StudentDetailDTO>('/api/v1/students', {
    method: 'POST',
    token,
    schoolId,
    body: JSON.stringify(data),
  });
}

export async function getStudentByIdApi(
  token: string,
  schoolId: string,
  studentId: string
): Promise<StudentDetailDTO> {
  return request<StudentDetailDTO>(`/api/v1/students/${studentId}`, {
    method: 'GET',
    token,
    schoolId,
  });
}

export async function updateStudentApi(
  token: string,
  schoolId: string,
  studentId: string,
  data: UpdateStudentDTO
): Promise<StudentDetailDTO> {
  return request<StudentDetailDTO>(`/api/v1/students/${studentId}`, {
    method: 'PATCH',
    token,
    schoolId,
    body: JSON.stringify(data),
  });
}

export async function updateStudentStatusApi(
  token: string,
  schoolId: string,
  studentId: string,
  isActive: boolean
): Promise<StudentDetailDTO> {
  return request<StudentDetailDTO>(`/api/v1/students/${studentId}/status`, {
    method: 'PATCH',
    token,
    schoolId,
    body: JSON.stringify({ isActive }),
  });
}

export async function linkStudentParentApi(
  token: string,
  schoolId: string,
  studentId: string,
  parentData: {
    fullName: string;
    phone: string;
    email?: string;
    relationType: string;
    isPrimaryContact?: boolean;
    canPickup?: boolean;
  }
): Promise<StudentDetailDTO> {
  return request<StudentDetailDTO>(`/api/v1/students/${studentId}/parents`, {
    method: 'POST',
    token,
    schoolId,
    body: JSON.stringify(parentData),
  });
}

export async function importStudentsApi(
  token: string,
  schoolId: string,
  rows: StudentImportRowDTO[]
): Promise<StudentImportResultDTO> {
  return request<StudentImportResultDTO>('/api/v1/students/import', {
    method: 'POST',
    token,
    schoolId,
    body: JSON.stringify({ rows }),
  });
}

export async function fetchClassesApi(
  token: string,
  schoolId: string
): Promise<ClassDTO[]> {
  return request<ClassDTO[]>('/api/v1/classes', {
    method: 'GET',
    token,
    schoolId,
  });
}

export async function createClassApi(
  token: string,
  schoolId: string,
  data: CreateClassDTO
): Promise<ClassDTO> {
  return request<ClassDTO>('/api/v1/classes', {
    method: 'POST',
    token,
    schoolId,
    body: JSON.stringify(data),
  });
}

export async function createSectionApi(
  token: string,
  schoolId: string,
  classId: string,
  data: { name: string; roomNumber?: string; capacity?: number }
): Promise<SectionDTO> {
  return request<SectionDTO>(`/api/v1/classes/${classId}/sections`, {
    method: 'POST',
    token,
    schoolId,
    body: JSON.stringify(data),
  });
}

