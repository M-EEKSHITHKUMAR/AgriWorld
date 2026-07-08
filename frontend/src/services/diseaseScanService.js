import api from './api';

export const scanDisease = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  const { data } = await api.post('/disease-scan', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getScanHistory = async () => {
  const { data } = await api.get('/disease-scan/history');
  return data;
};

export const getScanById = async (id) => {
  const { data } = await api.get(`/disease-scan/${id}`);
  return data;
};

export const deleteScan = async (id) => {
  const { data } = await api.delete(`/disease-scan/${id}`);
  return data;
};
