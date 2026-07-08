import api from './api';

export const registerUser = async (formData) => {
  const { data } = await api.post('/auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export const updateProfile = async (formData) => {
  const { data } = await api.put('/auth/me', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
