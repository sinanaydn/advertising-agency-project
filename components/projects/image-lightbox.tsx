'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  width: number | null;
  height: number | null;
}

interface ImageLightboxProps {
  images: GalleryImage[];
  projectTitle: string;
}

export function ImageLightbox({ images, projectTitle }: ImageLightboxProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const close = useCallback(() => setSelectedIndex(null), []);

  const prev = useCallback(() => {
    setSelectedIndex((i) => (i !== null && i > 0 ? i - 1 : images.length - 1));
  }, [images.length]);

  const next = useCallback(() => {
    setSelectedIndex((i) => (i !== null && i < images.length - 1 ? i + 1 : 0));
  }, [images.length]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex, close, prev, next]);

  if (images.length === 0) return null;

  return (
    <>
      {/* Gallery Grid */}
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className="relative overflow-hidden rounded-lg border border-border cursor-pointer hover:opacity-90 transition-opacity"
            aria-label={`${image.alt_text || `${projectTitle} - Görsel ${index + 1}`} - Büyütmek için tıklayın`}
          >
            <div className="aspect-video max-h-[400px]">
              <Image
                src={image.image_url}
                alt={image.alt_text || `${projectTitle} - Görsel ${index + 1}`}
                width={image.width || 1920}
                height={image.height || 1080}
                className="w-full h-full object-cover"
                quality={85}
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 440px"
              />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Görsel önizleme"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
            aria-label="Kapat"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Prev Button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
              aria-label="Önceki görsel"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedIndex].image_url}
              alt={images[selectedIndex].alt_text || `${projectTitle} - Görsel ${selectedIndex + 1}`}
              width={images[selectedIndex].width || 1920}
              height={images[selectedIndex].height || 1080}
              className="max-h-[90vh] w-auto object-contain"
              quality={90}
              sizes="90vw"
            />
          </div>

          {/* Next Button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
              aria-label="Sonraki görsel"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
