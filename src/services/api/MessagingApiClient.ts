import axios, { type AxiosError, type AxiosInstance } from 'axios';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errorUtils';

const DEFAULT_MESSAGING_API_URL = 'https://kinshipsync-messaging.vercel.app';

export class MessagingApiClient {
  private readonly client: AxiosInstance;

  constructor() {
    const baseURL =
      import.meta.env.VITE_MESSAGING_API_URL?.trim() || DEFAULT_MESSAGING_API_URL;

    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      const apiToken = import.meta.env.VITE_MESSAGING_API_TOKEN?.trim();
      if (apiToken) {
        config.headers.Authorization = `Bearer ${apiToken}`;
        config.headers['x-api-token'] = apiToken;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error('Messaging API Error:', error.response?.data || error.message);
        const message = getErrorMessage(error);
        toast.error(`Messaging: ${message}`);
        return Promise.reject(error);
      }
    );
  }

  getApiToken(): string | undefined {
    const token = import.meta.env.VITE_MESSAGING_API_TOKEN?.trim();
    return token || undefined;
  }

  getHttpClient(): AxiosInstance {
    return this.client;
  }
}

export const messagingApiClient = new MessagingApiClient();
