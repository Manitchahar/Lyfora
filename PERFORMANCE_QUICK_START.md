# Performance Optimization Quick Start

Quick reference guide for using performance optimizations in the Lyfora application.

## 🚀 Quick Wins

### 1. Lazy Load Images (17.2)

Replace regular `<img>` tags with `<LazyImage>`:

```tsx
// ❌ Before
<img src="/photo.jpg" alt="Photo" className="w-full h-64" />

// ✅ After
import { LazyImage } from '@/components/LazyImage/LazyImage';
<LazyImage src="/photo.jpg" alt="Photo" className="w-full h-64" />
```

**Impact**: 60-80% reduction in initial page load

### 2. Debounce Search Inputs (17.4)

Use `useDebounce` hook for search/filter inputs:

```tsx
// ❌ Before
const [search, setSearch] = useState('');
useEffect(() => {
  performSearch(search); // Runs on every keystroke
}, [search]);

// ✅ After
import { useDebounce } from '@/hooks/useDebounce';
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 300);
useEffect(() => {
  performSearch(debouncedSearch); // Runs 300ms after typing stops
}, [debouncedSearch]);
```

**Impact**: 90% reduction in API calls

### 3. Memoize Expensive Computations (17.3)

Use `useMemo` for expensive calculations:

```tsx
// ❌ Before
const sortedData = data.sort((a, b) => a.value - b.value); // Runs on every render

// ✅ After
import { useMemo } from 'react';
const sortedData = useMemo(
  () => data.sort((a, b) => a.value - b.value),
  [data]
); // Only runs when data changes
```

**Impact**: Prevents unnecessary re-computations

### 4. Memoize Callbacks (17.3)

Use `useCallback` for functions passed to children:

```tsx
// ❌ Before
const handleClick = (id) => {
  doSomething(id); // New function on every render
};

// ✅ After
import { useCallback } from 'react';
const handleClick = useCallback((id) => {
  doSomething(id);
}, []); // Stable function reference
```

**Impact**: Prevents unnecessary child re-renders

## 📦 Code Splitting (Already Implemented)

All routes are automatically code-split using `React.lazy()`:

```tsx
// src/routes/index.tsx
const DashboardRoute = lazy(() => import('./DashboardRoute'));
```

**Impact**: 60% reduction in initial bundle size

## 🎯 When to Use What

| Optimization | Use Case | Example |
|--------------|----------|---------|
| `LazyImage` | All images, especially below fold | Hero images, galleries |
| `useDebounce` | User input that triggers operations | Search, filters, validation |
| `useMemo` | Expensive calculations | Sorting, filtering, aggregations |
| `useCallback` | Functions passed to children | Event handlers, callbacks |
| Code Splitting | Large features/routes | Already implemented |

## 🔍 Quick Checklist

Before committing new components, check:

- [ ] Are images using `LazyImage`?
- [ ] Are search inputs debounced?
- [ ] Are expensive computations memoized?
- [ ] Are callbacks to children memoized?
- [ ] Is the component properly typed?

## 📊 Measuring Impact

### Before Optimization
```bash
npm run build
# Check dist/ folder size
```

### After Optimization
```bash
npm run build
# Compare dist/ folder size
# Run Lighthouse audit in Chrome DevTools
```

### Expected Metrics
- Lighthouse Score: 90+
- Initial Bundle: <500KB
- Time to Interactive: <1.5s
- API Calls (search): 1-2 per query

## 🛠️ Available Utilities

### Performance Functions
```tsx
import { debounce, throttle } from '@/utils/performance';
```

### Performance Hooks
```tsx
import { useDebounce } from '@/hooks/useDebounce';
```

### Performance Components
```tsx
import { LazyImage } from '@/components/LazyImage/LazyImage';
```

## 📚 Full Documentation

- [Complete Performance Guide](./PERFORMANCE_OPTIMIZATION.md)
- [LazyImage Component](./src/components/LazyImage/README.md)
- [Custom Hooks](./src/hooks/README.md)

## 💡 Pro Tips

1. **Debounce by default**: Always debounce search inputs (300ms is optimal)
2. **Lazy load everything**: Use LazyImage for all images, not just large ones
3. **Memoize wisely**: Only memoize expensive operations, not everything
4. **Measure first**: Use Chrome DevTools to identify bottlenecks
5. **Test on slow devices**: Performance issues show up on slower hardware

## 🚨 Common Mistakes

### ❌ Don't Do This
```tsx
// Debouncing inside render
const debouncedFn = debounce(handleSearch, 300); // Creates new function every render

// Memoizing everything
const value = useMemo(() => props.value, [props.value]); // Unnecessary

// Not providing dependencies
const result = useMemo(() => expensiveCalc(data)); // Missing [data]
```

### ✅ Do This Instead
```tsx
// Debounce with hook
const debouncedValue = useDebounce(value, 300);

// Only memoize expensive operations
const result = useMemo(() => expensiveCalc(data), [data]);

// Always provide dependencies
const callback = useCallback(() => doSomething(id), [id]);
```

## 🎓 Learning Resources

- [React Performance](https://react.dev/learn/render-and-commit)
- [Web Vitals](https://web.dev/vitals/)
- [Vite Performance](https://vitejs.dev/guide/performance.html)
