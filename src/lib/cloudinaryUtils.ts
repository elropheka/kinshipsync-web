export function isCloudinaryUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes('res.cloudinary.com');
  } catch {
    return false;
  }
}

/**
 * Extracts Cloudinary public_id from a secure URL.
 * Handles paths like /image/upload/v123/folder/name.jpg
 */
export function extractCloudinaryPublicId(url: string): string | null {
  if (!isCloudinaryUrl(url)) {
    return null;
  }

  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    const uploadIndex = pathParts.findIndex((part) => part === 'upload');

    if (uploadIndex === -1 || uploadIndex >= pathParts.length - 1) {
      return null;
    }

    let afterUpload = pathParts.slice(uploadIndex + 1);

    if (afterUpload.length > 0 && /^v\d+$/.test(afterUpload[0])) {
      afterUpload = afterUpload.slice(1);
    }

    if (afterUpload.length === 0) {
      return null;
    }

    const lastSegment = afterUpload[afterUpload.length - 1];
    const withoutExtension = lastSegment.replace(/\.[^/.]+$/, '');
    afterUpload[afterUpload.length - 1] = withoutExtension;

    return afterUpload.join('/');
  } catch {
    return null;
  }
}

export function sanitizeStorageFolder(path: string): string {
  return path.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
}

export function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URI.'));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error('FileReader failed.'));
    reader.readAsDataURL(file);
  });
}
