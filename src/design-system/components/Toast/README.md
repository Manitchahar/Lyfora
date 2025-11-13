# Toast Component

A notification system for displaying temporary messages to users. Supports different types (success, error, warning, info) with auto-dismiss functionality and optional action buttons.

## Requirements

- 16.1: Display error message within 200ms
- 16.2: Style error messages with semantic error color
- 16.4: Auto-dismiss non-critical errors after 5 seconds
- 16.5: Accessible to screen readers

## Features

- ✅ Four types: success, error, warning, info
- ✅ Auto-dismiss after configurable duration
- ✅ Manual dismiss with close button
- ✅ Optional action button
- ✅ Smooth enter/exit animations
- ✅ Accessible to screen readers
- ✅ Theme-aware styling
- ✅ Stacked notifications with max limit
- ✅ Configurable position

## Usage

### Setup

Wrap your application with `ToastProvider`:

```tsx
import { ToastProvider } from '../design-system/components';

function App() {
  return (
    <ToastProvider position="top-right" maxToasts={5}>
      <YourApp />
    </ToastProvider>
  );
}
```

### Basic Usage

Use the `useToast` hook to show notifications:

```tsx
import { useToast } from '../design-system/components';

function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success('Operation completed successfully!');
  };

  const handleError = () => {
    toast.error('Something went wrong. Please try again.');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Success</button>
      <button onClick={handleError}>Error</button>
    </div>
  );
}
```

### With Action Button

Add an action button for user interaction:

```tsx
const toast = useToast();

toast.error('Failed to save changes', {
  action: {
    label: 'Retry',
    onClick: () => {
      // Retry the operation
      saveChanges();
    },
  },
  duration: 0, // Don't auto-dismiss when action is available
});
```

### Custom Duration

Control how long the toast is displayed:

```tsx
// Show for 3 seconds
toast.info('Quick message', { duration: 3000 });

// Don't auto-dismiss
toast.warning('Important warning', { duration: 0 });
```

### Using the Generic Method

For more control, use the generic `showToast` method:

```tsx
const toast = useToast();

toast.showToast({
  message: 'Custom notification',
  type: 'info',
  duration: 5000,
  action: {
    label: 'View',
    onClick: () => console.log('Action clicked'),
  },
});
```

## ToastProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | Required | Child components |
| `maxToasts` | `number` | `5` | Maximum number of toasts to display |
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left' \| 'top-center' \| 'bottom-center'` | `'top-right'` | Position of toast container |

## useToast Hook

Returns an object with the following methods:

### `success(message, options?)`

Show a success toast with green styling.

```tsx
toast.success('Profile updated successfully!');
```

### `error(message, options?)`

Show an error toast with red styling.

```tsx
toast.error('Failed to load data');
```

### `warning(message, options?)`

Show a warning toast with amber styling.

```tsx
toast.warning('Your session will expire soon');
```

### `info(message, options?)`

Show an info toast with primary color styling.

```tsx
toast.info('New features available!');
```

### `showToast(options)`

Generic method for full control.

```tsx
toast.showToast({
  message: 'Custom message',
  type: 'success',
  duration: 3000,
  action: { label: 'Undo', onClick: handleUndo },
});
```

### `dismissToast(id)`

Dismiss a specific toast by ID.

```tsx
const id = toast.success('Message');
// Later...
toast.dismissToast(id);
```

### `dismissAll()`

Dismiss all visible toasts.

```tsx
toast.dismissAll();
```

## Toast Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `message` | `string` | Required | Toast message |
| `type` | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | Toast type |
| `duration` | `number` | `5000` | Duration in ms (0 = no auto-dismiss) |
| `action` | `{ label: string, onClick: () => void }` | - | Optional action button |

## Accessibility

- Uses `role="alert"` for toast container
- Uses `aria-live="assertive"` for errors, `"polite"` for others
- Uses `aria-atomic="true"` for complete message announcement
- Provides `aria-label` for dismiss button
- Keyboard accessible close button

## Best Practices

1. **Use appropriate types**: Match toast type to message severity
2. **Keep messages concise**: Short, actionable messages work best
3. **Provide actions when helpful**: Add retry buttons for failed operations
4. **Don't auto-dismiss critical errors**: Set `duration: 0` for errors requiring user action
5. **Limit toast count**: Default `maxToasts={5}` prevents overwhelming users

## Examples

### API Error Handling

```tsx
const toast = useToast();

async function fetchData() {
  try {
    const data = await api.getData();
    toast.success('Data loaded successfully');
  } catch (error) {
    toast.error('Failed to load data', {
      action: {
        label: 'Retry',
        onClick: fetchData,
      },
      duration: 0,
    });
  }
}
```

### Form Submission

```tsx
const toast = useToast();

async function handleSubmit(data) {
  try {
    await api.submitForm(data);
    toast.success('Form submitted successfully!');
    navigate('/success');
  } catch (error) {
    toast.error(error.message || 'Failed to submit form');
  }
}
```

### Progressive Actions

```tsx
const toast = useToast();

async function deleteItem(id) {
  const toastId = toast.info('Deleting item...');
  
  try {
    await api.deleteItem(id);
    toast.dismissToast(toastId);
    toast.success('Item deleted successfully');
  } catch (error) {
    toast.dismissToast(toastId);
    toast.error('Failed to delete item');
  }
}
```

## Styling

Toasts automatically adapt to the current theme (light/dark mode) and use semantic colors from the design system:

- **Success**: Green color scale
- **Error**: Red color scale
- **Warning**: Amber color scale
- **Info**: Primary (teal) color scale

All toasts include:
- Smooth animations (fade + slide)
- Backdrop blur effect
- Consistent spacing and typography
- Responsive sizing
