# LoadingSpinner Component

A theme-aware loading spinner component with multiple size variants following Apple's design principles.

## Requirements

- 15.1: Display loading indicator within 200ms
- 15.3: Theme-aware loading indicators
- 15.5: Remove loading indicators within 100ms when complete

## Features

- Four size variants: `sm` (16px), `md` (24px), `lg` (32px), `xl` (48px)
- Theme-aware colors using primary color palette
- Smooth rotation animation
- Accessible with ARIA labels and screen reader support
- Appears within 200ms as per requirements

## Usage

### Basic Usage

```tsx
import { LoadingSpinner } from '../../design-system/components';

function MyComponent() {
  return <LoadingSpinner />;
}
```

### With Custom Size

```tsx
<LoadingSpinner size="lg" />
```

### With Custom Label

```tsx
<LoadingSpinner label="Loading data..." />
```

### In a Button

```tsx
import { Button } from '../../design-system/components';

<Button loading={isLoading}>
  Submit
</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size variant of the spinner |
| `className` | `string` | `''` | Optional className for additional styling |
| `label` | `string` | `'Loading...'` | Accessible label for screen readers |

## Examples

### Centered Loading State

```tsx
<div className="flex items-center justify-center min-h-[200px]">
  <LoadingSpinner size="lg" label="Loading content..." />
</div>
```

### Inline Loading

```tsx
<div className="flex items-center gap-2">
  <LoadingSpinner size="sm" />
  <span>Processing...</span>
</div>
```

## Accessibility

- Uses `role="status"` for screen reader announcements
- Provides customizable `aria-label` for context
- Includes visually hidden text for screen readers
- Icon marked with `aria-hidden="true"` to avoid duplication

## Theme Support

The spinner automatically adapts to light and dark modes:
- Light mode: `text-primary-500`
- Dark mode: `text-primary-400`
