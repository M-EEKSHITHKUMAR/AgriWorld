import api from './api';

export const getSchemes = async (state) => {
  const { data } = await api.get('/schemes', { params: { state } });
  return data;
};
