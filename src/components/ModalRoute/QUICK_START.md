# Modal Routing Quick Start Guide

Get started with modal routing in 5 minutes!

## Basic Usage

### Step 1: Create Your Modal Content Component

```tsx
// src/components/MyFeature/MyContent.tsx
export function MyContent() {
  return (
    <div>
      <h2>My Modal Content</h2>
      <p>This content will be displayed in a modal.</p>
    </div>
  );
}
```

### Step 2: Create a Modal Route Component

```tsx
// src/routes/MyModalRoute.tsx
import ModalRoute from '../components/ModalRoute';
import { MyContent } from '../components/MyFeature/MyContent';

export function MyModalRoute() {
  return (
    <ModalRoute title="My Modal" size="md">
      <MyContent />
    </ModalRoute>
  );
}

export default MyModalRoute;
```

### Step 3: Add Route to Configuration

```tsx
// src/routes/index.tsx
import { lazy } from 'react';

const MyModalRoute = lazy(() => import('./MyModalRoute'));

export const routes = [
  // ... other routes
  {
    path: 'my-modal',
    element: <MyModalRoute />,
  },
];
```

### Step 4: Navigate to Your Modal

```tsx
// In any component
import { useModalNavigation } from '../hooks/useModalNavigation';

function MyButton() {
  const navigateToModal = useModalNavigation();
  
  return (
    <button onClick={() => navigateToModal('/my-modal')}>
      Open Modal
    </button>
  );
}
```

That's it! Your modal route is ready to use.

## Common Patterns

### Modal with URL Parameters

```tsx
// Route configuration
{
  path: 'users/:userId/edit',
  element: <EditUserModalRoute />,
}

// Modal route component
export function EditUserModalRoute() {
  const { userId } = useParams();
  
  return (
    <ModalRoute title="Edit User" size="lg">
      <EditUserForm userId={userId} />
    </ModalRoute>
  );
}

// Navigate with parameter
navigateToModal(`/users/${userId}/edit`);
```

### Modal with Query Parameters

```tsx
// Navigate with query params
navigateToModal('/settings?tab=profile');

// Access in modal
const [searchParams] = useSearchParams();
const tab = searchParams.get('tab');
```

### Large Full-Screen Modal

```tsx
<ModalRoute title="Image Gallery" size="full">
  <ImageGallery />
</ModalRoute>
```

### Modal Without Title or Close Button

```tsx
<ModalRoute showCloseButton={false}>
  <CustomModalWithOwnCloseButton />
</ModalRoute>
```

### Protected Modal Route

```tsx
{
  path: 'admin/settings',
  element: (
    <ProtectedRoute>
      <AdminSettingsModalRoute />
    </ProtectedRoute>
  ),
}
```

## Props Reference

### ModalRoute Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `undefined` | Modal title (optional) |
| `size` | `'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | Modal size |
| `showCloseButton` | `boolean` | `true` | Show close button |
| `className` | `string` | `''` | Additional CSS classes |
| `children` | `ReactNode` | required | Modal content |

### useModalNavigation Return Value

```typescript
function navigateToModal(
  to: string,
  options?: { replace?: boolean }
): void
```

## Tips & Tricks

### 1. Keyboard Shortcuts

Users can close modals with:
- Browser back button
- Escape key
- Click outside modal
- Close button (if shown)

### 2. Deep Linking

Modal routes work with direct URLs:
```
https://yourapp.com/dashboard/personas/123
```

The modal will open over the appropriate background page.

### 3. Focus Management

Focus is automatically:
- Trapped within the modal when open
- Restored to the triggering element when closed

No manual focus management needed!

### 4. State Preservation

The background page state is preserved:
- Scroll position maintained
- Form data retained
- Component state unchanged

### 5. Multiple Modals

Opening multiple modals in sequence:
```tsx
// Each adds a history entry
navigateToModal('/modal-1');  // Back button closes this
navigateToModal('/modal-2');  // Back button closes this
navigateToModal('/modal-3');  // Back button closes this
```

### 6. Programmatic Close

Close modal from within:
```tsx
import { useNavigate } from 'react-router-dom';

function MyModalContent() {
  const navigate = useNavigate();
  
  const handleSave = () => {
    // Save data...
    navigate(-1); // Close modal
  };
  
  return <button onClick={handleSave}>Save</button>;
}
```

## Common Issues

### Modal doesn't open

**Problem**: Modal doesn't appear when navigating

**Solution**: Make sure you're using `useModalNavigation` or passing `backgroundLocation` in state:

```tsx
// ✅ Correct
const navigateToModal = useModalNavigation();
navigateToModal('/my-modal');

// ❌ Wrong
navigate('/my-modal'); // Missing backgroundLocation
```

### Back button doesn't work

**Problem**: Back button doesn't close modal

**Solution**: Ensure your modal route uses `ModalRoute` component:

```tsx
// ✅ Correct
<ModalRoute title="My Modal">
  <Content />
</ModalRoute>

// ❌ Wrong
<Modal isOpen={true} onClose={...}>
  <Content />
</Modal>
```

### Focus not restored

**Problem**: Focus doesn't return to triggering element

**Solution**: Make sure the triggering element still exists in the DOM. If it's conditionally rendered, focus will go to body.

### Deep link shows content without modal

**Problem**: Direct URL doesn't open modal

**Solution**: This is expected behavior. The modal route needs `backgroundLocation` to know what to show behind it. For deep links, you may want to redirect to the base page first, then open the modal.

## Examples

### Example 1: User Profile Modal

```tsx
// Route
{
  path: 'profile/:username',
  element: <UserProfileModalRoute />,
}

// Component
export function UserProfileModalRoute() {
  const { username } = useParams();
  const { data: user } = useUser(username);
  
  return (
    <ModalRoute title={user?.name} size="lg">
      <UserProfile user={user} />
    </ModalRoute>
  );
}

// Usage
<button onClick={() => navigateToModal(`/profile/${username}`)}>
  View Profile
</button>
```

### Example 2: Confirmation Dialog

```tsx
// Route
{
  path: 'confirm-delete/:itemId',
  element: <ConfirmDeleteModalRoute />,
}

// Component
export function ConfirmDeleteModalRoute() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  
  const handleConfirm = async () => {
    await deleteItem(itemId);
    navigate(-1); // Close modal
  };
  
  return (
    <ModalRoute title="Confirm Delete" size="sm">
      <div>
        <p>Are you sure you want to delete this item?</p>
        <button onClick={handleConfirm}>Delete</button>
        <button onClick={() => navigate(-1)}>Cancel</button>
      </div>
    </ModalRoute>
  );
}
```

### Example 3: Image Lightbox

```tsx
// Route
{
  path: 'gallery/:imageId',
  element: <ImageLightboxModalRoute />,
}

// Component
export function ImageLightboxModalRoute() {
  const { imageId } = useParams();
  const image = images.find(img => img.id === imageId);
  
  return (
    <ModalRoute size="full" showCloseButton={true} className="p-0">
      <img src={image.url} alt={image.alt} className="w-full h-full object-contain" />
    </ModalRoute>
  );
}

// Usage in gallery
{images.map(image => (
  <img 
    key={image.id}
    src={image.thumbnail}
    onClick={() => navigateToModal(`/gallery/${image.id}`)}
  />
))}
```

## Next Steps

- Read [README.md](./README.md) for detailed documentation
- Check [TESTING.md](./TESTING.md) for testing guidelines
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details

## Need Help?

- Check the [TESTING.md](./TESTING.md) troubleshooting section
- Review existing modal routes in the codebase
- Ask the team for assistance

Happy coding! 🚀
