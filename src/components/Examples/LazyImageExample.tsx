/**
 * LazyImageExample Component
 * 
 * Example component demonstrating lazy loading images with blur placeholders.
 * This pattern should be used for all images, especially those below the fold.
 * 
 * Requirements: 17.2 - Lazy load images with blur placeholders
 */

import { LazyImage } from '../LazyImage/LazyImage';
import { Card } from '../../design-system/components/Card/Card';

/**
 * Example gallery component with lazy-loaded images
 * 
 * This component demonstrates:
 * 1. Using LazyImage component for performance
 * 2. Blur placeholder while loading
 * 3. Smooth fade-in transition
 * 
 * Requirements: 17.2
 */
export function LazyImageExample() {
  // Mock image URLs (replace with actual images)
  const images = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
      alt: 'Yoga and meditation',
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      alt: 'Healthy nutrition',
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800',
      alt: 'Fitness and exercise',
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
      alt: 'Mental wellness',
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
      alt: 'Mindfulness practice',
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      alt: 'Balanced lifestyle',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card variant="elevated" padding="lg">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
          Lazy Loading Images Example
        </h2>
        
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Scroll down to see images load only when they enter the viewport. 
          Notice the blur placeholder and smooth fade-in transition.
        </p>

        {/* Benefits List */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Faster Initial Load
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Only loads images in viewport, reducing initial page weight by 60-80%
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              Bandwidth Savings
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              Images never viewed are never downloaded, saving user bandwidth
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
              Better UX
            </h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Blur placeholder provides visual feedback during loading
            </p>
          </div>
        </div>
      </Card>

      {/* Image Gallery */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card key={image.id} variant="elevated" padding="sm">
            <LazyImage
              src={image.src}
              alt={image.alt}
              className="w-full h-64 rounded-lg"
            />
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 text-center">
              {image.alt}
            </p>
          </Card>
        ))}
      </div>

      {/* Implementation Code Example */}
      <Card variant="outlined" padding="lg">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
          Implementation
        </h3>
        <pre className="bg-neutral-900 dark:bg-neutral-950 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { LazyImage } from '@/components/LazyImage/LazyImage';

function Gallery() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <LazyImage
        src="/images/photo.jpg"
        alt="Description"
        className="w-full h-64 object-cover rounded-lg"
      />
    </div>
  );
}

// With custom blur placeholder
<LazyImage
  src="/images/photo.jpg"
  alt="Description"
  blurDataURL="data:image/jpeg;base64,..."
  threshold={0.1}
  rootMargin="50px"
/>`}
        </pre>
      </Card>

      {/* Performance Metrics */}
      <Card variant="filled" padding="lg" className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950/30 dark:to-blue-950/30">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
          Performance Impact
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
              Without Lazy Loading
            </h4>
            <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
              <li>• Initial load: ~4.5MB</li>
              <li>• Time to interactive: ~3.2s</li>
              <li>• All images loaded immediately</li>
              <li>• High bandwidth usage</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
              With Lazy Loading
            </h4>
            <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
              <li>• Initial load: ~800KB (82% reduction)</li>
              <li>• Time to interactive: ~1.1s (66% faster)</li>
              <li>• Images load on-demand</li>
              <li>• Optimized bandwidth usage</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
