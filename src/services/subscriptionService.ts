import { messagingApiClient } from './api/MessagingApiClient';

const api = messagingApiClient.getHttpClient();

interface CheckoutParams {
  userId: string;
  planId: string;
  interval: 'month' | 'year';
  couponCode?: string;
  successUrl: string;
  cancelUrl: string;
}

export const createCheckoutSession = async (params: CheckoutParams) => {
  const response = await api.post('/checkout', params);
  return response.data;
};

export const cancelSubscription = async (userId: string) => {
  const response = await api.post('/subscription/cancel', { userId });
  return response.data;
};

export const validateCoupon = async (code: string, planId: string, interval: 'month' | 'year') => {
  const response = await api.post('/coupon/validate', { code, planId, interval });
  return response.data;
};
