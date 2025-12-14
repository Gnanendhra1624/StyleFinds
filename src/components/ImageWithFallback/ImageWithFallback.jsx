import React, { useEffect, useState } from 'react';

const DEFAULT_FALLBACK = '/no-image-available.png';

export function ImageWithFallback({ src, alt, className, fallback = DEFAULT_FALLBACK, onLoad, ...rest }) {
  const [currentSrc, setCurrentSrc] = useState(() => {
    if (!src) return fallback;
    if (typeof src === 'string' && src.trim() === '') return fallback;
    return src;
  });

  useEffect(() => {
    if (!src || (typeof src === 'string' && src.trim() === '')) {
      setCurrentSrc(fallback);
    } else {
      setCurrentSrc(src);
    }
  }, [src, fallback]);

  function handleError() {
    if (currentSrc !== fallback) setCurrentSrc(fallback);
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={onLoad}
      {...rest}
    />
  );
}

export default ImageWithFallback;
