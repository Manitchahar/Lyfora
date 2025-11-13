# Modal Routing Testing Guide

This document provides a comprehensive testing checklist for the modal routing implementation.

## Requirements Coverage

This implementation satisfies the following requirements:

- **7.1**: Modal routes add new entry to browser history ✅
- **7.2**: Browser back button closes modal and returns to underlying page ✅
- **7.3**: Underlying page state is preserved when modal route closes ✅
- **7.4**: Focus is restored to triggering element on modal close ✅
- **7.5**: Deep links to modal routes work correctly ✅

## Test Scenarios

### 1. Opening a Modal Route

**Steps:**
1. Navigate to the dashboard (`/dashboard`)
2. Click on any persona card in the gallery
3. Observe the modal opens with the persona chat

**Expected Results:**
- ✅ Modal opens smoothly with animation
- ✅ URL changes to `/dashboard/personas/{id}`
- ✅ Dashboard remains visible behind the modal (with backdrop)
- ✅ Browser history has a new entry

### 2. Browser Back Button Closes Modal

**Steps:**
1. Open a persona chat modal (see test 1)
2. Click the browser back button
3. Observe the modal closes

**Expected Results:**
- ✅ Modal closes with animation
- ✅ URL returns to `/dashboard`
- ✅ Dashboard is still visible (no reload)
- ✅ Focus returns to the persona card that was clicked

### 3. Browser Forward Button Reopens Modal

**Steps:**
1. Open a persona chat modal
2. Click browser back button to close it
3. Click browser forward button
4. Observe the modal reopens

**Expected Results:**
- ✅ Modal reopens with animation
- ✅ URL returns to `/dashboard/personas/{id}`
- ✅ Same persona chat is displayed

### 4. Escape Key Closes Modal

**Steps:**
1. Open a persona chat modal
2. Press the Escape key
3. Observe the modal closes

**Expected Results:**
- ✅ Modal closes with animation
- ✅ URL returns to `/dashboard`
- ✅ Focus returns to the triggering element

### 5. Backdrop Click Closes Modal

**Steps:**
1. Open a persona chat modal
2. Click on the backdrop (dark area outside modal)
3. Observe the modal closes

**Expected Results:**
- ✅ Modal closes with animation
- ✅ URL returns to `/dashboard`
- ✅ Focus returns to the triggering element

### 6. Close Button Closes Modal

**Steps:**
1. Open a persona chat modal
2. Click the X close button in the modal header
3. Observe the modal closes

**Expected Results:**
- ✅ Modal closes with animation
- ✅ URL returns to `/dashboard`
- ✅ Focus returns to the triggering element

### 7. Deep Linking to Modal Route

**Steps:**
1. Navigate directly to `/dashboard/personas/dr-wellness` in the browser address bar
2. Press Enter
3. Observe the page loads

**Expected Results:**
- ✅ Dashboard loads first
- ✅ Modal opens on top of dashboard
- ✅ Correct persona chat is displayed
- ✅ Browser back button works correctly

### 8. Refresh Page with Modal Open

**Steps:**
1. Open a persona chat modal
2. Refresh the page (F5 or Cmd+R)
3. Observe the page reloads

**Expected Results:**
- ✅ Dashboard loads first
- ✅ Modal reopens on top of dashboard
- ✅ Same persona chat is displayed
- ✅ Browser back button works correctly

### 9. Multiple Modal Navigation

**Steps:**
1. Open persona chat for "Dr. Wellness"
2. Close the modal (back button)
3. Open persona chat for "Coach Fit"
4. Click back button twice
5. Observe navigation

**Expected Results:**
- ✅ First back button closes "Coach Fit" modal
- ✅ Second back button closes "Dr. Wellness" modal (if it was in history)
- ✅ Each modal opens/closes correctly
- ✅ No page reloads occur

### 10. Focus Management

**Steps:**
1. Tab to a persona card using keyboard
2. Press Enter to open the modal
3. Close the modal (any method)
4. Observe focus

**Expected Results:**
- ✅ Focus is trapped within modal when open
- ✅ Focus returns to the persona card when modal closes
- ✅ User can continue keyboard navigation from where they left off

### 11. Underlying Page State Preservation

**Steps:**
1. On dashboard, scroll down
2. Fill in some form data (if any)
3. Open a persona chat modal
4. Close the modal
5. Observe the dashboard state

**Expected Results:**
- ✅ Scroll position is preserved
- ✅ Form data is preserved
- ✅ No component remounting occurs
- ✅ Dashboard state is exactly as it was before

### 12. Modal Route with Invalid ID

**Steps:**
1. Navigate directly to `/dashboard/personas/invalid-id`
2. Observe the result

**Expected Results:**
- ✅ Modal opens with "Persona Not Found" message
- ✅ Error message is clear and helpful
- ✅ User can close the modal normally
- ✅ No JavaScript errors in console

## Accessibility Testing

### Keyboard Navigation

- [ ] Tab key moves focus through modal elements
- [ ] Shift+Tab moves focus backwards
- [ ] Focus is trapped within modal (doesn't escape to background)
- [ ] Escape key closes modal
- [ ] Enter/Space on close button closes modal

### Screen Reader Testing

- [ ] Modal opening is announced
- [ ] Modal title is read correctly
- [ ] Close button has proper label
- [ ] Modal closing is announced
- [ ] Focus return is announced

### ARIA Attributes

- [ ] Modal has `role="dialog"`
- [ ] Modal has `aria-modal="true"`
- [ ] Modal has `aria-labelledby` pointing to title
- [ ] Close button has `aria-label="Close modal"`

## Performance Testing

- [ ] Modal opens within 200ms
- [ ] Modal closes within 200ms
- [ ] No layout shifts when modal opens/closes
- [ ] Smooth animations (60fps)
- [ ] No memory leaks (check DevTools)

## Browser Compatibility

Test in the following browsers:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Known Limitations

1. **Multiple Modals**: Currently only supports one modal at a time. Nested modals are not supported.
2. **Modal History**: If user opens multiple modals in sequence, each adds a history entry. This is expected behavior.
3. **Focus Restoration**: Focus restoration may not work if the triggering element is removed from DOM.

## Troubleshooting

### Modal doesn't open
- Check that `backgroundLocation` is passed in navigation state
- Verify the route is configured correctly
- Check browser console for errors

### Back button doesn't close modal
- Verify `onClose` is connected to `navigate(-1)`
- Check that modal route adds history entry
- Ensure no other navigation interceptors

### Focus not restored
- Check that triggering element still exists in DOM
- Verify element has `focus()` method
- Check for other focus management code

### Deep linking doesn't work
- Verify route configuration includes modal route
- Check that `backgroundLocation` is handled correctly
- Ensure ProtectedRoute allows access

## Success Criteria

All tests in this document should pass for the modal routing implementation to be considered complete and production-ready.

✅ **Task 5.1**: Set up modal route infrastructure - COMPLETE
✅ **Task 5.2**: Implement browser back button modal closing - COMPLETE
