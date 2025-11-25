# Performance Optimization Guide

Best practices for optimizing React components and improving application performance.

## Table of Contents

1. [Component Memoization](#component-memoization)
2. [Callback Optimization](#callback-optimization)
3. [Render Optimization](#render-optimization)
4. [Code Splitting](#code-splitting)
5. [Image Optimization](#image-optimization)
6. [State Management](#state-management)
7. [Monitoring Performance](#monitoring-performance)

---

## Component Memoization

### `React.memo` for Functional Components

Memoize components that receive the same props to prevent unnecessary re-renders:

```typescript
// Before: Renders on every parent re-render
function UserCard({ user }) {
  return <div>{user.name}</div>;
}

// After: Only renders if 'user' prop changes
export default React.memo(UserCard);
```

### When to Use `React.memo`

- ✅ Pure functional components (no side effects)
- ✅ Components with expensive render logic
- ✅ Components that receive stable props from parent
- ❌ Components with frequently changing props
- ❌ Components with complex prop comparisons

### Custom Comparison

```typescript
export default React.memo(UserCard, (prevProps, nextProps) => {
  // Return true if props are equal (don't re-render)
  // Return false if props are different (re-render)
  return prevProps.userId === nextProps.userId;
});
```

---

## Callback Optimization

### `useCallback` for Event Handlers

Prevent creating new function instances on every render:

```typescript
// Before: New function created on every render
function SearchForm() {
  const handleSearch = (query) => {
    // expensive operation
  };
  return <input onChange={(e) => handleSearch(e.target.value)} />;
}

// After: Function reference is stable
function SearchForm() {
  const handleSearch = useCallback((query) => {
    // expensive operation
  }, [dependencies]);
  return <input onChange={(e) => handleSearch(e.target.value)} />;
}
```

### When to Use `useCallback`

- ✅ Callbacks passed to memoized child components
- ✅ Callbacks used in dependency arrays
- ✅ Handlers for expensive operations
- ❌ Trivial callbacks (just return)
- ❌ Callbacks with many dependencies

### Dependencies Matter

```typescript
// Good: Specific dependencies
const handleClick = useCallback(() => {
  console.log(userId);
}, [userId]); // Only recreate when userId changes

// Bad: All dependencies
const handleClick = useCallback(() => {
  console.log(userId, userName, userEmail);
}, [userId, userName, userEmail]); // Recreates too often
```

---

## Value Memoization

### `useMemo` for Expensive Computations

Cache computed values to avoid recalculation:

```typescript
// Before: Recalculates on every render
function VoteSummary({ votes }) {
  const averageRating = votes.reduce((a, b) => a + b.rating, 0) / votes.length;
  return <div>{averageRating}</div>;
}

// After: Only recalculates when votes change
function VoteSummary({ votes }) {
  const averageRating = useMemo(() => {
    return votes.reduce((a, b) => a + b.rating, 0) / votes.length;
  }, [votes]);
  return <div>{averageRating}</div>;
}
```

### When to Use `useMemo`

- ✅ Expensive computations (filtering large arrays, calculations)
- ✅ Objects/arrays passed to memoized children
- ✅ Complex derived state
- ❌ Simple calculations
- ❌ Small data transformations

---

## Render Optimization

### Code Splitting with Dynamic Imports

Lazy-load heavy components:

```typescript
// Before: Entire component loaded upfront
import SecuritySettings from '@/components/Settings/SecuritySettings';

// After: Loaded only when needed
const SecuritySettings = lazy(() =>
  import('@/components/Settings/SecuritySettings')
);

// Use with Suspense
<Suspense fallback={<LoadingSkeleton />}>
  <SecuritySettings />
</Suspense>
```

### Virtualization for Large Lists

Only render visible items:

```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={10000}
  itemSize={50}
>
  {({ index, style }) => (
    <div style={style}>
      {items[index].title}
    </div>
  )}
</FixedSizeList>
```

### Avoid Rendering Arrays

```typescript
// Bad: Creates new array on every render
<div>{items.map(item => <Item key={item.id} item={item} />)}</div>

// Good: Keep array stable
const itemElements = useMemo(() =>
  items.map(item => <Item key={item.id} item={item} />),
  [items]
);
return <div>{itemElements}</div>;
```

---

## Image Optimization

### Use Next.js Image Component

```typescript
// Before: Basic img tag, unoptimized
<img src="/profile.jpg" alt="Profile" />

// After: Optimized with Next.js
import Image from 'next/image';

<Image
  src="/profile.jpg"
  alt="Profile"
  width={200}
  height={200}
  quality={80}
/>
```

### Benefits

- ✅ Automatic format conversion (WebP, etc.)
- ✅ Lazy loading
- ✅ Responsive image sizing
- ✅ Built-in caching

---

## State Management

### Keep State Local

Lift state only when needed:

```typescript
// Bad: State in global store if only used locally
const [showModal, setShowModal] = useGlobalState('showModal');

// Good: Local state
const [showModal, setShowModal] = useState(false);
```

### Use useCallback with Dependencies

```typescript
// Hooks for common state patterns
function MyComponent() {
  const { value, toggle, setTrue, setFalse } = useBoolean(false);
  // Stable callbacks, won't cause re-renders
  return (
    <button onClick={toggle}>
      {value ? 'Hide' : 'Show'}
    </button>
  );
}
```

### Batch Updates

```typescript
// React 18+ automatically batches updates
const handleMultipleUpdates = () => {
  setName('John');
  setEmail('john@example.com');
  setAge(30);
  // Only triggers one re-render
};
```

---

## Network Optimization

### Request Deduplication

```typescript
// Use custom hook to prevent duplicate requests
const { data, loading } = useAsyncCached(
  'user-profile',
  fetchUserProfile,
  { ttl: 5 * 60 * 1000 } // Cache for 5 minutes
);
```

### Lazy Loading Data

```typescript
// Only fetch when needed
const [showDetails, setShowDetails] = useState(false);
const { data: details } = useFetch(
  showDetails ? `/api/show/${showId}/details` : null
);
```

---

## Monitoring Performance

### Chrome DevTools - Lighthouse

1. Open DevTools → Lighthouse tab
2. Run audit for Performance, Accessibility, SEO
3. Review suggestions and implement improvements

### React DevTools Profiler

```typescript
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
}

<Profiler id="Settings" onRender={onRenderCallback}>
  <SettingsPage />
</Profiler>
```

### Performance Monitoring

```typescript
// Track component render time
const startTime = performance.now();
// ... component render logic
const endTime = performance.now();
console.log(`Render took ${endTime - startTime}ms`);
```

---

## Performance Checklist

- [ ] Components using memoization where appropriate
- [ ] Callbacks memoized for expensive operations
- [ ] Large lists virtualized or paginated
- [ ] Images optimized with Next.js Image
- [ ] Code splitting for large routes
- [ ] State kept local when possible
- [ ] Network requests deduped and cached
- [ ] Bundle size analyzed and optimized
- [ ] Lighthouse audit score > 90
- [ ] No unnecessary re-renders (profiler tested)

---

## Common Pitfalls

### Creating Objects in Render

```typescript
// Bad: New object every render
<Component style={{ color: 'red' }} />

// Good: Stable reference
const buttonStyle = useMemo(() => ({ color: 'red' }), []);
<Component style={buttonStyle} />
```

### Creating Arrays in Render

```typescript
// Bad: New array every render
const visibleItems = items.filter(item => item.visible);

// Good: Stable reference
const visibleItems = useMemo(() =>
  items.filter(item => item.visible),
  [items]
);
```

### Unnecessary Dependencies

```typescript
// Bad: Recreates on every render because of unnecessary deps
const handleClick = useCallback(() => {
  console.log('clicked');
}, [userId, userName, userEmail]);

// Good: No dependencies needed
const handleClick = useCallback(() => {
  console.log('clicked');
}, []);
```

---

## Resources

- [React Performance Documentation](https://react.dev/learn/render-and-commit)
- [Web Vitals Guide](https://web.dev/vitals/)
- [Next.js Performance Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Chrome DevTools Profiler](https://developer.chrome.com/docs/devtools/performance/)
