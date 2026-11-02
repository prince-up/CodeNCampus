import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach token automatically
api.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem('codencampus-auth') || '{}')
  const token = auth?.state?.token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const login = (data) => api.post('/auth/login', data)
export const getMe = () => api.get('/auth/me')

// Students
export const getStudents = () => api.get('/students')
export const getStudent = (id) => api.get(`/students/${id}`)
export const createStudent = (data) => api.post('/students', data)
export const updateStudent = (id, data) => api.put(`/students/${id}`, data)
export const deleteStudent = (id) => api.delete(`/students/${id}`)

// Teachers
export const getTeachers = () => api.get('/teachers')
export const getTeacher = (id) => api.get(`/teachers/${id}`)
export const createTeacher = (data) => api.post('/teachers', data)
export const updateTeacher = (id, data) => api.put(`/teachers/${id}`, data)
export const deleteTeacher = (id) => api.delete(`/teachers/${id}`)

// Classes
export const getClasses = () => api.get('/classes')
export const createClass = (data) => api.post('/classes', data)
export const updateClass = (id, data) => api.put(`/classes/${id}`, data)
export const deleteClass = (id) => api.delete(`/classes/${id}`)

// Subjects
export const getSubjects = (cls) => api.get('/subjects', { params: { class: cls } })
export const createSubject = (data) => api.post('/subjects', data)
export const updateSubject = (id, data) => api.put(`/subjects/${id}`, data)
export const deleteSubject = (id) => api.delete(`/subjects/${id}`)

// Attendance
export const markAttendance = (data) => api.post('/attendance/mark', data)
export const getStudentAttendance = (studentId, params) => api.get(`/attendance/student/${studentId}`, { params })
export const getClassAttendance = (cls, section, params) => api.get(`/attendance/class/${cls}/${section}`, { params })
export const getAttendanceReport = () => api.get('/attendance/report')

// Exams & Results
export const getExams = (cls) => api.get('/exams', { params: { class: cls } })
export const createExam = (data) => api.post('/exams', data)
export const updateExam = (id, data) => api.put(`/exams/${id}`, data)
export const deleteExam = (id) => api.delete(`/exams/${id}`)
export const getExamResults = (examId) => api.get(`/exams/${examId}/results`)
export const getStudentResults = (studentId) => api.get(`/exams/results/student/${studentId}`)
export const saveResults = (data) => api.post('/exams/results', data)

// Fees
export const getFees = (params) => api.get('/fees', { params })
export const createFee = (data) => api.post('/fees', data)
export const updateFee = (id, data) => api.put(`/fees/${id}`, data)
export const getStudentFees = (studentId) => api.get(`/fees/student/${studentId}`)
export const getFeeCollection = (params) => api.get('/fees/collection', { params })

// Notices
export const getNotices = (params) => api.get('/notices', { params })
export const createNotice = (data) => api.post('/notices', data)
export const updateNotice = (id, data) => api.put(`/notices/${id}`, data)
export const deleteNotice = (id) => api.delete(`/notices/${id}`)

// Timetable
export const getTimetable = (cls, section) => api.get(`/timetable/${cls}/${section}`)
export const saveTimetable = (data) => api.post('/timetable', data)

// Dashboard
export const getAdminStats = () => api.get('/dashboard/admin')

export default api
