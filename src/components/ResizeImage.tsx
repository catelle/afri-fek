import Image from 'next/image';
import { useState, useEffect } from 'react';

// Utility to resize image while keeping aspect ratio
const resizeImage = (src: string, maxWidth: number, maxHeight: number) => {
  return new Promise<string>((resolve) => {
    const img = new window.Image();
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
  priority?:boolean;
}

export const ResizedImage = ({
  src,
  alt,
  maxWidth = 192,
  maxHeight = 128,
  className,
  priority,
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
    <div className={className} style={{ position: 'relative', width: maxWidth, height: maxHeight }}>
      <Image
        src={resizedSrc}
        alt={alt}
        fill
        style={{
          objectFit: 'contain'
        }}
        onError={(e) => {
          e.currentTarget.src = '/search.png';
        }}
        priority={priority}
      />
    </div>
  );
};