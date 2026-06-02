import { ref, deleteObject } from 'firebase/storage';
import type { AxiosError } from 'axios';
import { storage } from './firebaseConfig';
import { messagingApiClient } from './api/MessagingApiClient';
import {
  extractCloudinaryPublicId,
  fileToDataUri,
  isCloudinaryUrl,
  sanitizeStorageFolder,
} from '@/lib/cloudinaryUtils';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

interface StorageApiResponse {
  success: boolean;
  data?: {
    url: string;
  };
  message?: string;
  error?: string;
}

export class StorageService {
  private ensureApiToken(): void {
    if (!messagingApiClient.getApiToken()) {
      throw new Error(
        'Storage API token is not configured. Set VITE_MESSAGING_API_TOKEN in your environment.'
      );
    }
  }

  async uploadFileToStorage(file: File, path: string): Promise<string> {
    if (!file) {
      throw new Error('No file provided for upload.');
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(
        `File is too large. Maximum size is ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB.`
      );
    }

    this.ensureApiToken();

    const folder = sanitizeStorageFolder(path);
    const dataUri = await fileToDataUri(file);
    const resourceType = file.type.startsWith('image/') ? 'image' : 'raw';

    try {
      const response = await messagingApiClient
        .getHttpClient()
        .post<StorageApiResponse>('/storage/upload', {
          file: dataUri,
          folder,
          resourceType,
        });

      if (!response.data.success || !response.data.data?.url) {
        throw new Error(
          response.data.error || response.data.message || 'Upload failed'
        );
      }

      return response.data.data.url;
    } catch (error) {
      const axiosError = error as AxiosError<StorageApiResponse>;
      console.error('Error uploading file to messaging storage:', error);
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        (error instanceof Error ? error.message : 'Unknown error during file upload.');
      throw new Error(`Failed to upload file: ${errorMessage}`);
    }
  }

  async deleteFileFromStorage(downloadUrl: string): Promise<void> {
    if (!downloadUrl) {
      console.warn('No download URL provided for deletion.');
      return;
    }

    if (isCloudinaryUrl(downloadUrl)) {
      await this.deleteCloudinaryFile(downloadUrl);
      return;
    }

    await this.deleteFirebaseFile(downloadUrl);
  }

  private async deleteCloudinaryFile(downloadUrl: string): Promise<void> {
    const publicId = extractCloudinaryPublicId(downloadUrl);
    if (!publicId) {
      console.warn(`Could not parse Cloudinary public_id from URL: ${downloadUrl}`);
      return;
    }

    this.ensureApiToken();

    try {
      await messagingApiClient.getHttpClient().delete<StorageApiResponse>('/storage/delete', {
        data: {
          publicId,
          resourceType: 'image',
        },
      });
    } catch (error) {
      const axiosError = error as AxiosError<StorageApiResponse>;
      console.error('Error deleting file from Cloudinary:', error);
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        (error instanceof Error ? error.message : 'Unknown error during file deletion.');
      console.warn(`Failed to delete Cloudinary file ${downloadUrl}: ${errorMessage}`);
    }
  }

  private async deleteFirebaseFile(downloadUrl: string): Promise<void> {
    try {
      const storageRef = ref(storage, downloadUrl);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting file from Firebase storage:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error during file deletion.';
      console.warn(`Failed to delete Firebase file ${downloadUrl}: ${errorMessage}`);
    }
  }
}

const storageService = new StorageService();

export const uploadFileToStorage = (file: File, path: string): Promise<string> =>
  storageService.uploadFileToStorage(file, path);

export const deleteFileFromStorage = (downloadUrl: string): Promise<void> =>
  storageService.deleteFileFromStorage(downloadUrl);
