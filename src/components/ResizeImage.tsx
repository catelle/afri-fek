import { useState, useEffect } from 'react';

// Utility to resize image while keeping aspect ratio
const resizeImage = (src: string, maxWidth: number, maxHeight: number) => {
  return new Promise<string>((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
      const canvas = document.createElement('canvas');
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL());
    };
    img.onerror = () => resolve('/search.png'); // fallback
  });
};

interface ResizedImageProps {
  src: string;
  alt: string;
  maxWidth?: number; // max width for large screens
  maxHeight?: number; // max height
}

export const ResizedImage = ({
  src,
  alt,
  maxWidth = 192,
  maxHeight = 128,
}: ResizedImageProps) => {
  const [resizedSrc, setResizedSrc] = useState(src);

  useEffect(() => {
    resizeImage(src, maxWidth, maxHeight).then(setResizedSrc);
  }, [src, maxWidth, maxHeight]);

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
