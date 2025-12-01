import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errorUtils';
import { uploadFileToStorage } from '@/services/storageService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        const errMsg = 'Invalid file type. Please select an image.';
        toast.error(errMsg);
        if (onError) onError(errMsg);
        setSelectedFile(null);
        setPreviewUrl(currentImageUrl || null); // Revert to original if invalid file
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      const errMsg = 'No file selected to upload.';
      toast.error(errMsg);
      if (onError) onError(errMsg);
      return;
    }

    setIsLoading(true);
    try {
      const downloadURL = await uploadFileToStorage(selectedFile, storagePath);
      onImageUploaded(downloadURL);
      setPreviewUrl(downloadURL); // Update preview to the actual stored URL
      setSelectedFile(null); // Clear selected file after successful upload
      toast.success('Image uploaded successfully.');
    } catch (err) {
      const errorMessage = getErrorMessage(err) || 'Unknown error during upload.';
      console.error('Upload failed:', errorMessage);
      toast.error(`Upload failed: ${errorMessage}`);
      if (onError) onError(errorMessage);
      // Do not clear selectedFile or previewUrl on failure, so user can retry or choose another
    } finally {
      setIsLoading(false);
    }
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
    fileInputRef.current?.click();
  };

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
