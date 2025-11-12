// src/utils/api.js
import axios from 'axios';
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api' });

export const getClasses = () => API.get('/classes').then(r => r.data);
export const getSubjects = (classId) => API.get(`/classes/${classId}/subjects`).then(r => r.data);
export const getUnits = (classId, subject) => API.get(`/classes/${classId}/subjects/${encodeURIComponent(subject)}/units`).then(r => r.data);
export const getQuestions = (params) => API.get('/questions', { params }).then(r => r.data);
