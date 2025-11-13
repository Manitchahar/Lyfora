# Design System Components

This directory contains the core design system components for the Lyfora application, following Apple-inspired design principles.

## Components

### Button
A versatile button component with multiple variants and states.

**Features:**
- Variants: primary, secondary, tertiary, ghost
- Sizes: sm, md, lg
- Loading state with spinner
- Hover, active, and disabled states with animations
- Full keyboard accessibility and ARIA attributes

**Usage:**
```tsx
import { Button } from '@/design-system';

<Button variant="primary" size="md" loading={false}>
  Click me
</Button>
```

### Input
A text input component with label, error, and helper text support.

**Features:**
- Label with proper association
- Error state with red border and error message
- Helper text for additional guidance
- Left-aligned icon support
- Focus states with primary color ring
- Full keyboard accessibility and ARIA attributes

**Usage:**
```tsx
import { Input } from '@/design-system';

<Input
  label="Email"
  type="email"
  error="Invalid email"
  helperText="Enter your email address"
  icon={<Mail size={18} />}
/>
```

### Card
A versatile card component with multiple variants and padding options.

**Features:**
- Variants: elevated (with shadow), outlined (with border), filled (with background)
- Padding sizes: sm (16px), md (24px), lg (32px)
- Optional hover effect with shadow transition
- Consistent 16px border radius
- Theme-aware colors

**Usage:**
```tsx
import { Card } from '@/design-system';

<Card variant="elevated" padding="md" hoverable>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>
```

### Modal
A modal dialog component built with Radix UI Dialog primitive.

**Features:**
- Built on Radix UI Dialog for accessibility
- Backdrop blur effect (8px)
- Smooth enter/exit animations with Framer Motion
- Size variants: sm, md, lg, full
- Focus trap within modal
- Scroll lock on body when open
- Close on backdrop click or Escape key
- Restores focus to triggering element on close

**Usage:**
```tsx
import { Modal } from '@/design-system';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="md"
>
  <p>Modal content goes here</p>
</Modal>
```

### ThemeToggle
A toggle button for switching between light and dark themes.

**Features:**
- Toggle button with sun/moon icons
- Smooth icon transition animation
- Connects to useTheme hook for theme switching
- Full keyboard accessibility
- Proper ARIA labels for screen readers
- Respects system preference when theme is 'system'

**Usage:**
```tsx
import { ThemeToggle } from '@/design-system';

<ThemeToggle size="md" />
```

### LoadingSpinner
A theme-aware loading spinner component with multiple size variants.

**Features:**
- Four size variants: sm (16px), md (24px), lg (32px), xl (48px)
- Theme-aware colors using primary color palette
- Smooth rotation animation
- Accessible with ARIA labels
- Appears within 200ms as per requirements

**Usage:**
```tsx
import { LoadingSpinner } from '@/design-system';

<LoadingSpinner size="lg" label="Loading data..." />
```

### Skeleton
A skeleton loading component for content placeholders.

**Features:**
- Three variants: text, circular, rectangular
- Theme-aware colors with smooth pulse animation
- Flexible sizing with CSS values or 'full' width
- Multi-line text support
- Accessible with ARIA attributes
- Respects reduced motion preferences

**Usage:**
```tsx
import { Skeleton } from '@/design-system';

// Single skeleton
<Skeleton height="80px" />

// Multiple text lines
<Skeleton variant="text" lines={3} />

// Circular (for avatars)
<Skeleton variant="circular" width="48px" height="48px" />
```

## Requirements Satisfied

- **2.1**: Button component with variants (primary, secondary, tertiary)
- **2.2**: Input component with consistent styling
- **2.3**: Card component with consistent padding and border radius
- **2.4**: Modal component with backdrop blur and animations
- **1.5**: Visual feedback within 100ms for interactive elements
- **12.3**: Spring physics animations for interactive elements
- **14.2**: Keyboard navigation with visible focus indicators
- **14.5**: Form inputs with proper label associations
- **3.2**: Theme Toggle control accessible from all pages
- **3.3**: Theme switching within 200ms
- **14.3**: ARIA labels for all icon buttons
- **14.10**: Proper ARIA labels for screen readers
- **15.1**: Loading indicators appear within 200ms
- **15.2**: Skeleton screens for content loading
- **15.3**: Theme-aware loading indicators
- **15.5**: Loading indicators removed within 100ms when complete

## Architecture

All components follow these principles:
- Built with TypeScript for type safety
- Use Tailwind CSS for styling with custom design tokens
- Support both light and dark themes
- Include proper accessibility attributes
- Feature smooth animations with Framer Motion
- Follow Apple's minimal design aesthetic
