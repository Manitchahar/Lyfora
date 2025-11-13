# ModalRoute Component

A wrapper component for routes that should be displayed as modals while preserving the underlying page.

## Features

- ✅ Automatically opens when route is active
- ✅ Closes modal by navigating back (browser back button)
- ✅ Preserves underlying page using location state
- ✅ Restores focus to triggering element on close
- ✅ Adds history entry for proper browser navigation
- ✅ Supports deep linking to modal routes

## Requirements

Implements requirements: 7.1, 7.2, 7.3, 7.4, 7.5

## Usage

### 1. Define a Modal Route

```tsx
// In your routes configuration
{
  path: 'dashboard/personas/:id',
  element: (
    <ModalRoute title="Persona Chat" size="lg">
      <PersonaChatContent />
    </ModalRoute>
  ),
}
```

### 2. Navigate to a Modal Route

Use the `useModalNavigation` hook for easy navigation:

```tsx
import { useModalNavigation } from '../../hooks/useModalNavigation';

function PersonaCard({ personaId }) {
  const navigateToModal = useModalNavigation();
  
  const handleClick = () => {
    navigateToModal(`/dashboard/personas/${personaId}`);
  };
  
  return (
    <button onClick={handleClick}>
      Open Persona Chat
    </button>
  );
}
```

Or use `navigate` directly with location state:

```tsx
import { useNavigate, useLocation } from 'react-router-dom';

function PersonaCard({ personaId }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleClick = () => {
    navigate(`/dashboard/personas/${personaId}`, {
      state: { backgroundLocation: location }
    });
  };
  
  return (
    <button onClick={handleClick}>
      Open Persona Chat
    </button>
  );
}
```

## How It Works

### Modal Route Pattern

The modal routing pattern uses React Router's location state to preserve the underlying page:

1. **Opening a Modal**: When navigating to a modal route, pass the current location as `backgroundLocation` in the state
2. **Rendering**: The app renders both the background location (underlying page) and the modal route
3. **Closing**: Clicking back, pressing Escape, or clicking the backdrop calls `navigate(-1)` to go back
4. **Deep Linking**: Direct URLs to modal routes work correctly - the modal opens over the appropriate base page

### Browser History

- Opening a modal adds a new history entry
- Browser back button closes the modal and returns to the underlying page
- Browser forward button can reopen the modal if available in history

### Focus Management

- When a modal opens, the currently focused element is stored
- When the modal closes, focus is restored to that element
- This ensures keyboard navigation remains predictable

## Props

The `ModalRoute` component accepts all props from the `Modal` component except `isOpen` and `onClose`:

```tsx
interface ModalRouteProps {
  /** Modal title */
  title?: string;
  /** Size variant: 'sm' | 'md' | 'lg' | 'full' */
  size?: 'sm' | 'md' | 'lg' | 'full';
  /** Whether to show the close button */
  showCloseButton?: boolean;
  /** Additional className for the content */
  className?: string;
  /** Modal content */
  children: React.ReactNode;
}
```

## Examples

### Basic Modal Route

```tsx
<ModalRoute title="Settings">
  <SettingsForm />
</ModalRoute>
```

### Large Modal with Custom Styling

```tsx
<ModalRoute 
  title="Image Gallery" 
  size="full"
  className="p-0"
>
  <ImageGallery />
</ModalRoute>
```

### Modal Without Title or Close Button

```tsx
<ModalRoute showCloseButton={false}>
  <CustomModalContent />
</ModalRoute>
```

## Testing

To test modal routing:

1. Navigate to a modal route - it should open as a modal
2. Click the browser back button - the modal should close
3. Click the browser forward button - the modal should reopen
4. Refresh the page while modal is open - the modal should reopen over the base page
5. Press Escape key - the modal should close
6. Click outside the modal - the modal should close
7. Tab through interactive elements - focus should be trapped in the modal
8. Close the modal - focus should return to the triggering element

## Architecture

```
User clicks link/button
    ↓
navigate(path, { state: { backgroundLocation } })
    ↓
Router renders both:
  - Background location (underlying page)
  - Current location (modal route)
    ↓
ModalRoute component:
  - Detects backgroundLocation in state
  - Opens Modal with isOpen={true}
  - Stores focused element
    ↓
User closes modal (back button, Escape, backdrop click)
    ↓
navigate(-1)
    ↓
Router renders only background location
    ↓
Focus restored to triggering element
```
