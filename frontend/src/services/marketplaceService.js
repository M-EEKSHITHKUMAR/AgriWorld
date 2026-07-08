import api from './api';

export const getListings = async (filters = {}) => {
  const { data } = await api.get('/marketplace', { params: filters });
  return data;
};

export const getMyListings = async () => {
  const { data } = await api.get('/marketplace/mine');
  return data;
};

export const getListingById = async (id) => {
  const { data } = await api.get(`/marketplace/${id}`);
  return data;
};

export const createListing = async (formData) => {
  const { data } = await api.post('/marketplace', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const updateListing = async (id, formData) => {
  const { data } = await api.put(`/marketplace/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const deleteListing = async (id) => {
  const { data } = await api.delete(`/marketplace/${id}`);
  return data;
};
