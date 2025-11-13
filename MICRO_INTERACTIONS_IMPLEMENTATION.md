# Micro-Interactions Implementation

This document describes the micro-interactions implemented across the design system components.

## Requirements

- **1.3**: Smooth transitions with duration between 150ms and 300ms
- **1.5**: Visual feedback within 100ms on hover
- **12.3**: Spring physics with stiffness 300 and damping 30 for interactive animations
- **12.4**: Respect prefers-reduced-motion setting

## Implementation Summary

### Button Component

**Location**: `src/design-system/components/Button/Button.tsx`

**Micro-interactions**:
- ✅ Hover scale animation: `scale-[1.02]` (150ms transition)
- ✅ Active scale animation: `scale-[0.98]` (150ms transition)
- ✅ Shadow transition on hover: `shadow-sm` → `shadow-md`
- ✅ Background color transitions (150ms)
- ✅ Respects `prefers-reduced-motion` via `motion-safe:` prefix

**Code**:
```tsx
'motion-safe:hover:scale-[1.02]',
'motion-safe:active:scale-[0.98]',
'transition-all',
'duration-150',
'ease-out',
```

### Card Component

**Location**: `src/design-system/components/Card/Card.tsx`

**Micro-interactions**:
- ✅ Hover scale animation: `scale-[1.01]` (150ms transition) when `hoverable` prop is true
- ✅ Shadow transition on hover: `shadow-md` → `shadow-lg` (elevated variant)
- ✅ Border color transition on hover (outlined variant)
- ✅ Background color transition on hover (filled variant)
- ✅ Respects `prefers-reduced-motion` via `motion-safe:` prefix

**Code**:
```tsx
'motion-safe:hover:scale-[1.01]',
'transition-all',
'duration-150',
'ease-out',
```

### Input Component

**Location**: `src/design-system/components/Input/Input.tsx`

**Micro-interactions**:
- ✅ Focus scale animation: `scale-[1.01]` (150ms transition)
- ✅ Focus shadow animation: adds `shadow-sm` on focus
- ✅ Border color transition on focus
- ✅ Ring animation on focus (primary color)
- ✅ Respects `prefers-reduced-motion` via `motion-safe:` prefix

**Code**:
```tsx
'motion-safe:focus:scale-[1.01]',
'motion-safe:focus:shadow-sm',
'transition-all',
'duration-150',
'ease-out',
```

### Theme Transitions

**Location**: `src/index.css`

**Micro-interactions**:
- ✅ Smooth theme transitions (200ms) for:
  - Background colors
  - Text colors
  - Border colors
- ✅ Applied to all interactive elements (buttons, inputs, textareas, selects)
- ✅ Respects `prefers-reduced-motion` via media query

**Code**:
```css
body {
  transition: background-color 200ms ease-in-out, color 200ms ease-in-out;
}

button, input, textarea, select {
  transition: background-color 200ms ease-in-out, 
              border-color 200ms ease-in-out, 
              color 200ms ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Accessibility

All micro-interactions respect the user's `prefers-reduced-motion` setting:

1. **Tailwind's `motion-safe:` prefix**: Only applies animations when motion is not reduced
2. **Global CSS media query**: Overrides all animations to near-instant (0.01ms) when motion is reduced
3. **Smooth transitions**: All transitions use `ease-out` or `ease-in-out` timing functions for natural feel

## Testing

To test the micro-interactions:

1. **Hover interactions**: Hover over buttons and hoverable cards to see scale and shadow animations
2. **Focus interactions**: Tab to inputs and observe the scale and shadow animations
3. **Active state**: Click and hold buttons to see the active scale animation
4. **Theme transitions**: Toggle between light and dark mode to see smooth color transitions
5. **Reduced motion**: Enable "Reduce motion" in system preferences and verify animations are disabled

## Performance

All animations use GPU-accelerated properties:
- `transform: scale()` - GPU accelerated
- `box-shadow` - Optimized for smooth transitions
- `opacity` - GPU accelerated (used in other components)

Avoid animating layout properties like `width`, `height`, `padding`, or `margin` for optimal performance.

## Future Enhancements

Potential future micro-interactions to consider:
- Ripple effect on button clicks
- Floating label animation for inputs
- Skeleton loading animations
- Toast notification slide-in animations
- Modal backdrop blur animations (already implemented)
