import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errorUtils';
import { uploadFileToStorage } from '@/services/storageService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadInputProps {
  label: string;
  currentImageUrl?: string | null;
  storagePath: string; // e.g., 'vendorLogos', 'userAvatars'
  onImageUploaded: (newUrl: string) => void;
  onImageRemoved: () => void; // Called when user intends to remove, actual deletion on form save
  onError?: (errorMessage: string) => void;
  className?: string;
  imageClassName?: string; // For styling the preview image
  buttonSize?: 'sm' | 'default' | 'lg' | 'icon'; // Optional prop for button size
  /** Round profile picker: image on top, camera button, auto-upload on select */
  variant?: 'default' | 'avatar';
}

const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label,
  currentImageUrl,
  storagePath,
  onImageUploaded,
  onImageRemoved,
  onError,
  className,
  imageClassName = 'w-32 h-32 object-cover rounded-md border',
  buttonSize = 'sm',
  variant = 'default',
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Update preview if currentImageUrl prop changes externally
    if (currentImageUrl !== previewUrl && !selectedFile) {
      setPreviewUrl(currentImageUrl || null);
    }
  }, [currentImageUrl, selectedFile, previewUrl]);

  const uploadFile = async (file: File) => {
    setIsLoading(true);
    try {
      const downloadURL = await uploadFileToStorage(file, storagePath);
      onImageUploaded(downloadURL);
      setPreviewUrl(downloadURL);
      setSelectedFile(null);
      if (variant !== 'avatar') {
        toast.success('Image uploaded successfully.');
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Unknown error during upload.';
      console.error('Upload failed:', errorMessage);
      toast.error(`Upload failed: ${errorMessage}`);
      if (onError) onError(errorMessage);
      setPreviewUrl(currentImageUrl || null);
      setSelectedFile(null);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      const errMsg = 'Invalid file type. Please select an image.';
      toast.error(errMsg);
      if (onError) onError(errMsg);
      setSelectedFile(null);
      setPreviewUrl(currentImageUrl || null);
      return;
    }

    setSelectedFile(file);
    const blobUrl = URL.createObjectURL(file);
    setPreviewUrl(blobUrl);

    if (variant === 'avatar') {
      void uploadFile(file);
      return;
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      const errMsg = 'No file selected to upload.';
      toast.error(errMsg);
      if (onError) onError(errMsg);
      return;
    }
    await uploadFile(selectedFile);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onImageRemoved(); // Signal intent to remove
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the file input
    }
  };

  const triggerFileInput = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };

  const inputId = label.replace(/\s+/g, '-').toLowerCase();

  if (variant === 'avatar') {
    return (
      <div className={cn('flex flex-col items-center', className)}>
        <div className="relative">
          <Avatar className="h-28 w-28 border-2 border-border shadow-sm">
            <AvatarImage src={previewUrl ?? undefined} alt="Profile" className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={triggerFileInput}
            disabled={isLoading}
            aria-label="Update profile photo"
            className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-secondary text-secondary-foreground shadow-md transition-colors hover:bg-secondary/90 disabled:opacity-60"
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>
        {isLoading && (
          <p className="mt-2 text-sm text-muted-foreground">Uploading photo…</p>
        )}
        <Input
          id={inputId}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
          aria-hidden
        />
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={label.replace(/\s+/g, '-').toLowerCase()}>{label}</Label>
      {previewUrl && (
        <div className="my-2">
          <img src={previewUrl} alt="Preview" className={imageClassName} />
        </div>
      )}
      <Input
        id={label.replace(/\s+/g, '-').toLowerCase()}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden" // Hidden, triggered by button
      />
      <div className="flex space-x-2">
        <Button type="button" onClick={triggerFileInput} variant="outline" size={buttonSize} disabled={isLoading}>
          {previewUrl || selectedFile ? 'Change Image' : 'Select Image'}
        </Button>
        {selectedFile && !isLoading && (
          <Button type="button" onClick={handleUpload} size={buttonSize}>
            Upload Selected
          </Button>
        )}
        {(previewUrl || selectedFile) && !isLoading && (
          <Button type="button" onClick={handleRemoveImage} variant="destructive" size={buttonSize}>
            Remove Image
          </Button>
        )}
      </div>
      {isLoading && <p className="text-sm text-muted-foreground">Uploading...</p>}
    </div>
  );
};

export default ImageUploadInput;
