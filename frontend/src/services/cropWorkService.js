import api from './api';

export const getCropWorks = async () => {
  const { data } = await api.get('/crop-works');
  return data;
};

export const getReminders = async (tab) => {
  const { data } = await api.get('/crop-works/reminders', { params: { tab } });
  return data;
};

export const createCropWork = async (payload) => {
  const { data } = await api.post('/crop-works', payload);
  return data;
};

export const updateCropWork = async (id, payload) => {
  const { data } = await api.put(`/crop-works/${id}`, payload);
  return data;
};

export const markWorkCompleted = async (id) => {
  const { data } = await api.patch(`/crop-works/${id}/complete`);
  return data;
};

export const snoozeReminder = async (id, days = 1) => {
  const { data } = await api.patch(`/crop-works/${id}/snooze`, { days });
  return data;
};

export const deleteCropWork = async (id) => {
  const { data } = await api.delete(`/crop-works/${id}`);
  return data;
};
