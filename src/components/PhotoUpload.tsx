import { useState } from 'react';
import { Button } from './ui/button';
import { Camera, X, Upload, Loader2 } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface PhotoUploadProps {
  entityType: 'inspection' | 'issue';
  entityId: string;
  onPhotosChange?: (photos: any[]) => void;
}

export function PhotoUpload({ entityType, entityId, onPhotosChange }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const uploadedPhotos = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('entityType', entityType);
        formData.append('entityId', entityId);

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-947de7aa/photos/upload`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }

        const result = await response.json();
        uploadedPhotos.push({
          id: result.photoId,
          url: result.url,
          name: file.name,
        });
      }

      const newPhotos = [...photos, ...uploadedPhotos];
      setPhotos(newPhotos);
      onPhotosChange?.(newPhotos);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleDelete = async (photoId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-947de7aa/photos/${photoId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      const newPhotos = photos.filter(p => p.id !== photoId);
      setPhotos(newPhotos);
      onPhotosChange?.(newPhotos);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete photo');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="file"
          id={`photo-upload-${entityId}`}
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        <label htmlFor={`photo-upload-${entityId}`}>
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            disabled={uploading}
            asChild
          >
            <span>
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4" />
                  Upload Photos
                </>
              )}
            </span>
          </Button>
        </label>
        {photos.length > 0 && (
          <span className="text-sm text-slate-500">
            {photos.length} photo{photos.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.url}
                alt={photo.name}
                className="w-full h-32 object-cover rounded-lg border border-slate-200"
              />
              <button
                onClick={() => handleDelete(photo.id)}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity truncate">
                {photo.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
