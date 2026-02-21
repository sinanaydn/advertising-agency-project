'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import type { UploadedImage } from '@/types';

interface ImageItem {
  url: string;
  path: string;
  alt_text?: string;
  display_order: number;
  width: number;
  height: number;
}

interface ImageUploadProps {
  images: ImageItem[];
  onUpload: (image: ImageItem) => void;
  onRemove: (index: number) => void;
  disabled?: boolean;
}

export function ImageUpload({ images, onUpload, onRemove, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        const data = result.data as UploadedImage;
        onUpload({
          url: data.url,
          path: data.path,
          display_order: images.length,
          width: data.width,
          height: data.height,
        });
      } else {
        alert(result.error || 'Yükleme başarısız');
      }
    } catch {
      alert('Yükleme başarısız');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      await uploadFile(file);
    }
    e.target.value = '';
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled || isUploading) return;

      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith('image/')
      );

      for (const file of files) {
        await uploadFile(file);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [disabled, isUploading, images.length]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  return (
    <div className="space-y-4">
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={image.path}
              className="relative aspect-video overflow-hidden rounded-lg border border-border"
            >
              <Image
                src={image.url}
                alt={image.alt_text || `Görsel ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {!disabled && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={() => onRemove(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      <label
        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary'
        } ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center justify-center py-4">
          {isUploading ? (
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          ) : (
            <>
              <Upload className="h-10 w-10 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Tıklayın</span> veya sürükleyin
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, WEBP (Maks. 10MB)
              </p>
            </>
          )}
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileChange}
          disabled={disabled || isUploading}
        />
      </label>
    </div>
  );
}
