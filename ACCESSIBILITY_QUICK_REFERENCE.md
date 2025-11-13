# Accessibility Quick Reference

Quick reference guide for maintaining accessibility standards in the Lyfora application.

## Quick Checks

### ✅ Before Committing Code

1. **Keyboard Navigation**: Can you navigate your component with Tab/Shift+Tab?
2. **Focus Indicators**: Are focus indicators visible on all interactive elements?
3. **ARIA Labels**: Do icon-only buttons have aria-label?
4. **Color Contrast**: Does text meet 4.5:1 contrast ratio?
5. **Semantic HTML**: Are you using proper HTML elements (button, nav, main)?

## Common Patterns

### Icon-Only Button
```tsx
<button aria-label="Close modal">
  <X aria-hidden="true" />
  <span className="sr-only">Close modal</span>
</button>
```

### Form Input
```tsx
<label htmlFor={id}>{label}</label>
<input
  id={id}
  aria-describedby={error ? errorId : undefined}
  aria-invalid={error ? 'true' : 'false'}
  aria-required={required}
/>
{error && <p id={errorId} role="alert">{error}</p>}
```

### Navigation Link
```tsx
<Link
  to="/dashboard"
  aria-current={isActive ? 'page' : undefined}
>
  Dashboard
</Link>
```

### Loading State
```tsx
<button aria-busy={loading} disabled={loading}>
  {loading ? (
    <>
      <Loader2 className="animate-spin" aria-hidden="true" />
      <span className="sr-only">Loading...</span>
    </>
  ) : (
    'Submit'
  )}
</button>
```

### Modal Dialog
```tsx
<Dialog.Root open={isOpen} onOpenChange={onClose}>
  <Dialog.Content role="dialog" aria-modal="true" aria-labelledby="title">
    <Dialog.Title id="title">Modal Title</Dialog.Title>
    {/* Content */}
  </Dialog.Content>
</Dialog.Root>
```

## ARIA Attributes Reference

| Attribute | Use Case | Example |
|-----------|----------|---------|
| `aria-label` | Label for elements without visible text | `<button aria-label="Close">` |
| `aria-labelledby` | Reference to element that labels this one | `<div aria-labelledby="title">` |
| `aria-describedby` | Reference to element that describes this one | `<input aria-describedby="error">` |
| `aria-hidden` | Hide decorative elements from screen readers | `<Icon aria-hidden="true" />` |
| `aria-live` | Announce dynamic content changes | `<div aria-live="polite">` |
| `aria-current` | Indicate current item in navigation | `<Link aria-current="page">` |
| `aria-expanded` | Indicate expanded/collapsed state | `<button aria-expanded={open}>` |
| `aria-invalid` | Indicate form validation error | `<input aria-invalid="true">` |
| `aria-required` | Indicate required form field | `<input aria-required="true">` |
| `aria-busy` | Indicate loading state | `<button aria-busy={loading}>` |

## Focus Management

### Focus Indicators
All interactive elements automatically get focus indicators via Tailwind:
```tsx
focus:outline-none
focus:ring-2
focus:ring-primary-500
focus:ring-offset-2
dark:focus:ring-offset-neutral-900
```

### Focus Trap (Modals)
```tsx
import { trapFocus } from '@/utils/accessibility';

useEffect(() => {
  if (isOpen && modalRef.current) {
    const cleanup = trapFocus(modalRef.current);
    return cleanup;
  }
}, [isOpen]);
```

## Color Contrast

### Testing Colors
```typescript
import { meetsWCAGAA } from '@/utils/accessibility';

const result = meetsWCAGAA('#111827', '#f9fafb');
console.log(result); // { passes: true, ratio: 16.1, required: 4.5 }
```

### Minimum Ratios
- **Normal text**: 4.5:1
- **Large text** (18pt+ or 14pt+ bold): 3:1

### Approved Color Combinations

**Light Mode**:
- Body: `text-neutral-900` on `bg-neutral-50` ✅
- Muted: `text-neutral-500` on `bg-neutral-50` ✅
- Primary: `text-primary-600` on `bg-neutral-50` ✅

**Dark Mode**:
- Body: `text-neutral-100` on `bg-neutral-900` ✅
- Muted: `text-neutral-400` on `bg-neutral-900` ✅
- Primary: `text-primary-400` on `bg-neutral-900` ✅

## Semantic HTML

### Page Structure
```tsx
<main id="main-content" role="main">
  <nav aria-label="Main navigation">
    {/* Navigation items */}
  </nav>
  
  <section aria-labelledby="section-title">
    <h2 id="section-title">Section Title</h2>
    {/* Section content */}
  </section>
  
  <footer role="contentinfo">
    {/* Footer content */}
  </footer>
</main>
```

### Heading Hierarchy
```tsx
<h1>Page Title</h1>
  <h2>Major Section</h2>
    <h3>Subsection</h3>
    <h3>Another Subsection</h3>
  <h2>Another Major Section</h2>
```

❌ **Don't skip levels**: h1 → h3 (skips h2)
✅ **Do follow order**: h1 → h2 → h3

## Screen Reader Support

### Visually Hidden Text
```tsx
<span className="sr-only">Text for screen readers only</span>
```

### Announce Messages
```typescript
import { announceToScreenReader } from '@/utils/accessibility';

announceToScreenReader('Form submitted successfully', 'polite');
```

### Hide Decorative Elements
```tsx
<Icon aria-hidden="true" />
<div aria-hidden="true">{/* Decorative content */}</div>
```

## Testing Checklist

### Manual Testing
- [ ] Tab through all interactive elements
- [ ] Verify focus indicators are visible
- [ ] Test Enter/Space to activate buttons
- [ ] Test Escape to close modals
- [ ] Test with screen reader (NVDA/JAWS/VoiceOver)
- [ ] Verify route changes are announced
- [ ] Check color contrast in both themes

### Automated Testing
- [ ] Run axe DevTools
- [ ] Run Lighthouse accessibility audit
- [ ] Check for console warnings

## Common Mistakes to Avoid

❌ **Don't**:
- Use `<div>` for buttons (use `<button>`)
- Use `onClick` on non-interactive elements
- Skip heading levels (h1 → h3)
- Use color alone to convey information
- Forget to label icon-only buttons
- Use placeholder as label
- Disable focus indicators

✅ **Do**:
- Use semantic HTML elements
- Provide text alternatives for images
- Ensure keyboard accessibility
- Maintain proper heading hierarchy
- Label all form inputs
- Test with keyboard only
- Test with screen reader

## Utilities Available

### Accessibility Utils (`@/utils/accessibility`)
- `getContrastRatio(color1, color2)` - Calculate contrast ratio
- `meetsWCAGAA(color1, color2, isLargeText)` - Test WCAG AA
- `generateAriaLabel(action, context)` - Generate labels
- `prefersReducedMotion()` - Check motion preference
- `announceToScreenReader(message, priority)` - Announce to SR
- `trapFocus(element)` - Trap focus in element
- `getFocusableElements(container)` - Get focusable elements
- `validateHeadingHierarchy(container)` - Validate headings

## Resources

- **Full Documentation**: See `ACCESSIBILITY_COMPLIANCE.md`
- **Implementation Summary**: See `ACCESSIBILITY_IMPLEMENTATION_SUMMARY.md`
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **ARIA Practices**: https://www.w3.org/WAI/ARIA/apg/

## Questions?

If you're unsure about accessibility for a specific component:
1. Check existing components for similar patterns
2. Review the full accessibility documentation
3. Test with keyboard and screen reader
4. Use the accessibility utilities to verify
5. Ask for a code review with accessibility focus

Remember: Accessibility is not optional—it's a core requirement for all features.
