import { useState, useEffect } from 'react';

// Utility to resize image while keeping aspect ratio
const resizeImage = (src: string, maxWidth: number, maxHeight: number) => {
  return new Promise<string>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL());
      } catch (error) {
        resolve(src); // fallback to original src
      }
    };
    img.onerror = () => resolve('/search.png');
    img.src = src;
  });
};

interface ResizedImageProps {
  src: string;
  alt: string;
  maxWidth?: number; // max width for large screens
  maxHeight?: number; // max height
  className?: string;
}

export const ResizedImage = ({
  src,
  alt,
  maxWidth = 192,
  maxHeight = 128,
  className,
}: ResizedImageProps) => {
  const [resizedSrc, setResizedSrc] = useState('');

  useEffect(() => {
    if (src) {
      resizeImage(src, maxWidth, maxHeight).then(setResizedSrc);
    } else {
      setResizedSrc('/search.png');
    }
  }, [src, maxWidth, maxHeight]);

  if (!resizedSrc) {
    return null;
  }

  return (
    <img
      src={resizedSrc}
      alt={alt}
      style={{
        maxWidth: '100%',   // responsive width
        height: 'auto',     // maintain aspect ratio
        display: 'block',
        margin: '0 auto',
      }}
      onError={(e) => {
        e.currentTarget.src = '/search.png';
      }}
    />
  );
};