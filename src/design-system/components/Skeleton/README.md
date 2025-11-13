# Skeleton Component

A skeleton loading component for content placeholders following Apple's design principles with smooth pulse animations.

## Requirements

- 15.2: Skeleton screens for content loading
- 15.3: Theme-aware loading indicators
- 15.5: Loading indicators appear within 200ms

## Features

- Three variants: `text`, `circular`, `rectangular`
- Theme-aware colors with smooth pulse animation
- Flexible sizing with CSS values or 'full' width
- Multi-line text support
- Accessible with ARIA attributes
- Respects reduced motion preferences

## Usage

### Basic Usage

```tsx
import { Skeleton } from '../../design-system/components';

function MyComponent() {
  return <Skeleton />;
}
```

### Text Skeleton

```tsx
// Single line
<Skeleton variant="text" />

// Multiple lines
<Skeleton variant="text" lines={3} />
```

### Circular Skeleton (for avatars)

```tsx
<Skeleton variant="circular" width="48px" height="48px" />
```

### Rectangular Skeleton (for images/cards)

```tsx
<Skeleton variant="rectangular" height="200px" />
```

### Custom Sizing

```tsx
<Skeleton width="300px" height="100px" />
<Skeleton width="50%" height="80px" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `string \| 'full'` | `'full'` | Width of the skeleton (CSS value or 'full') |
| `height` | `string` | varies | Height of the skeleton (CSS value) |
| `variant` | `'text' \| 'circular' \| 'rectangular'` | `'rectangular'` | Shape variant of the skeleton |
| `className` | `string` | `''` | Optional className for additional styling |
| `lines` | `number` | `1` | Number of lines for text variant |

## Examples

### Dashboard Card Skeleton

```tsx
import { Card, Skeleton } from '../../design-system/components';

function DashboardCardSkeleton() {
  return (
    <Card variant="elevated" padding="md">
      <div className="space-y-4">
        <Skeleton width="40%" height="24px" />
        <Skeleton height="80px" />
        <Skeleton height="80px" />
        <Skeleton height="80px" />
      </div>
    </Card>
  );
}
```

### User Profile Skeleton

```tsx
<div className="flex items-center gap-4">
  <Skeleton variant="circular" width="48px" height="48px" />
  <div className="flex-1 space-y-2">
    <Skeleton width="60%" height="20px" />
    <Skeleton width="40%" height="16px" />
  </div>
</div>
```

### List Skeleton

```tsx
<div className="space-y-3">
  {[1, 2, 3].map((i) => (
    <Skeleton key={i} height="60px" />
  ))}
</div>
```

### Text Content Skeleton

```tsx
<div className="space-y-4">
  <Skeleton width="80%" height="32px" /> {/* Title */}
  <Skeleton variant="text" lines={4} /> {/* Paragraph */}
</div>
```

## Accessibility

- Uses `role="status"` for screen reader announcements
- Provides `aria-label="Loading content"` for context
- Includes visually hidden text for screen readers
- Skeleton elements marked with `aria-hidden="true"`

## Theme Support

The skeleton automatically adapts to light and dark modes:
- Light mode: `bg-neutral-200`
- Dark mode: `bg-neutral-700`

## Animation

- Uses CSS `animate-pulse` for smooth pulsing effect
- Respects `prefers-reduced-motion` setting
- Pulse animation duration: ~2 seconds

## Best Practices

1. **Match Content Structure**: Design skeletons to match the actual content layout
2. **Use Appropriate Variants**: 
   - `text` for text content
   - `circular` for avatars/profile pictures
   - `rectangular` for images, cards, and other content blocks
3. **Multi-line Text**: Use `lines` prop for paragraph content
4. **Consistent Sizing**: Match skeleton dimensions to actual content
5. **Loading Time**: Show skeletons for content that takes >500ms to load
