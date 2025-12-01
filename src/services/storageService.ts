import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'; // getStorage removed
import { storage } from './firebaseConfig'; // Import the initialized storage instance

/**
 * Uploads a file to Firebase Storage.
 * @param file The file to upload.
 * @param path The path in Firebase Storage where the file should be stored (e.g., 'vendorLogos', 'portfolioImages').
 * @returns A promise that resolves with the download URL of the uploaded file.
 */
export const uploadFileToStorage = async (file: File, path: string): Promise<string> => {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  // Create a unique file name to prevent overwrites, e.g., using timestamp or UUID
  const fileName = `${path}/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, fileName);

  try {
    const uploadTask = await uploadBytesResumable(storageRef, file);
    const downloadURL = await getDownloadURL(uploadTask.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    // It's good practice to type the error or check its structure
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during file upload.';
    throw new Error(`Failed to upload file: ${errorMessage}`);
  }
};

/**
 * Deletes a file from Firebase Storage using its download URL.
 * @param downloadUrl The download URL of the file to delete.
 * @returns A promise that resolves when the file is deleted.
 */
export const deleteFileFromStorage = async (downloadUrl: string): Promise<void> => {
  if (!downloadUrl) {
    console.warn('No download URL provided for deletion.');
    return;
  }
  try {
    const storageRef = ref(storage, downloadUrl); // This gets a reference from the download URL
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file from storage:', error);
    // It's good practice to type the error or check its structure
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during file deletion.';
    // Optionally, rethrow or handle if deletion failure is critical
    // For example, if the URL is malformed, Firebase might throw an error.
    // If the file doesn't exist, it might not throw an error, or it might. Check Firebase docs.
    // Generally, we might not want to throw an error here if the main operation can still proceed.
    console.warn(`Failed to delete file ${downloadUrl}: ${errorMessage}`);
  }
};
