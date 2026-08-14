'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

interface SmartImageProps extends Omit<ImageProps, 'src' | 'onError' | 'alt'> {
  src: string;
  fallback?: string;
  alt: string;
}

/**
 * next/image con fallback automático si la imagen falla al cargar.
 */
export function SmartImage({
  src,
  fallback = '/poster-placeholder.png',
  alt,
  ...props
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  return (
    <Image
      src={failed ? fallback : src}
      alt={alt}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
