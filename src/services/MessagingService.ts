import type { AxiosError } from 'axios';
import { messagingApiClient } from './api/MessagingApiClient';

export interface SendEmailParams {
  to: string;
  subject: string;
  body: string;
  from?: string;
  cc?: string[];
  bcc?: string[];
}

export interface SendTextParams {
  to: string;
  message: string;
  from?: string;
}

export interface SendPushParams {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  badge?: number;
  sound?: string;
  priority?: 'high' | 'normal';
}

export interface MessagingApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export class MessagingService {
  private getTokenOrError(): string | null {
    const apiToken = messagingApiClient.getApiToken();
    if (!apiToken) {
      const errorMessage =
        'Messaging API token is not configured. Set VITE_MESSAGING_API_TOKEN in your environment.';
      console.error('❌', errorMessage);
      return null;
    }
    return apiToken;
  }

  async sendEmail(params: SendEmailParams): Promise<MessagingApiResponse> {
    if (!this.getTokenOrError()) {
      return {
        success: false,
        error: 'Unauthorized',
        message:
          'Messaging API token is not configured. Set VITE_MESSAGING_API_TOKEN in your environment.',
      };
    }

    try {
      const response = await messagingApiClient
        .getHttpClient()
        .post<MessagingApiResponse>('/email', params);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<MessagingApiResponse>;
      console.error('Error sending email:', error);
      return {
        success: false,
        error: axiosError.response?.data?.error || 'Failed to send email',
        message: axiosError.response?.data?.message || axiosError.message,
      };
    }
  }

  async sendText(params: SendTextParams): Promise<MessagingApiResponse> {
    if (!this.getTokenOrError()) {
      return {
        success: false,
        error: 'Unauthorized',
        message:
          'Messaging API token is not configured. Set VITE_MESSAGING_API_TOKEN in your environment.',
      };
    }

    try {
      const response = await messagingApiClient
        .getHttpClient()
        .post<MessagingApiResponse>('/text', params);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<MessagingApiResponse>;
      console.error('Error sending text:', error);
      return {
        success: false,
        error: axiosError.response?.data?.error || 'Failed to send text message',
        message: axiosError.response?.data?.message || axiosError.message,
      };
    }
  }

  async sendPush(params: SendPushParams): Promise<MessagingApiResponse> {
    if (!this.getTokenOrError()) {
      return {
        success: false,
        error: 'Unauthorized',
        message:
          'Messaging API token is not configured. Set VITE_MESSAGING_API_TOKEN in your environment.',
      };
    }

    try {
      const response = await messagingApiClient
        .getHttpClient()
        .post<MessagingApiResponse>('/push', params);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<MessagingApiResponse>;
      console.error('Error sending push notification:', error);
      return {
        success: false,
        error: axiosError.response?.data?.error || 'Failed to send push notification',
        message: axiosError.response?.data?.message || axiosError.message,
      };
    }
  }
}

export const messagingService = new MessagingService();
