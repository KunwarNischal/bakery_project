import api from './api';

export const updateOrderStatus = async (orderId, status) => {
  const { data } = await api.put(`/orders/${orderId}/status`, { status });
  return data;
};
