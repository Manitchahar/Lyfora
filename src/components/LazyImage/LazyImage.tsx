/**
 * LazyImage Component
 * 
 * A lazy-loading image component with blur placeholder support.
 * Images are only loaded when they enter the viewport, improving
 * initial page load performance.
 * 
 * Requirements: 17.2 - Lazy load images with blur placeholders
 */

import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { generateBlurPlaceholder } from '../../utils/performance';

interface LazyImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  blurDataURL?: string;
  threshold?: number;
  rootMargin?: string;
}

/**
 * LazyImage component that loads images only when they enter the viewport
 * 
 * @param src - The image source URL
 * @param alt - Alt text for accessibility
 * @param blurDataURL - Optional custom blur placeholder data URL
 * @param threshold - Intersection observer threshold (0-1)
 * @param rootMargin - Root margin for intersection observer
 * @param className - Additional CSS classes
 * @param props - Additional img element props
 * 
 * Requirements: 17.2
 * 
 * @example
 * ```tsx
 * <LazyImage
 *   src="/images/hero.jpg"
 *   alt="Hero image"
 *   className="w-full h-64 object-cover"
 * />
 * ```
 */
export function LazyImage({
  src,
  alt,
  blurDataURL,
  threshold = 0.1,
  rootMargin = '50px',
  className = '',
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const placeholderURL = blurDataURL || generateBlurPlaceholder();

  useEffect(() => {
    // Set up Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blur placeholder */}
      <img
        src={placeholderURL}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ filter: 'blur(10px)', transform: 'scale(1.1)' }}
      />
      
      {/* Actual image */}
      <img
        ref={imgRef}
        src={isInView ? src : placeholderURL}
        alt={alt}
        onLoad={handleLoad}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        {...props}
      />
    </div>
  );
}
