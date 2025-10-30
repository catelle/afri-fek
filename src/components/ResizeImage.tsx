import { resizeImage } from '../utils/imageResize';
import { useState, useEffect } from 'react';
export const ResizedImage = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
  const [resizedSrc, setResizedSrc] = useState(src);
  
  useEffect(() => {
    resizeImage(src, 192, 128).then(setResizedSrc);
  }, [src]);
  
  return (
    <img
      src={resizedSrc}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.src = "/search.png";
      }}
    />
  );
};