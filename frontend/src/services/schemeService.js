import api from './api';

export const getSchemes = async (state) => {
  const { data } = await api.get('/schemes', { params: { state } });
  return data;
};

export const createScheme = async (payload) => {
  const { data } = await api.post('/schemes', payload);
  return data;
};
