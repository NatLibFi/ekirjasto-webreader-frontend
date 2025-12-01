# Reader Components API Documentation

## ThFooter

A footer component for the reader interface.

### Props

```typescript
type ThFooterProps = HTMLAttributesWithRef<HTMLDivElement>
```

## ThHeader

A header component for the reader interface.

### Props

```typescript
type ThHeaderProps = HTMLAttributesWithRef<HTMLDivElement>
```

## ThLoader

A loading indicator component with accessibility support.

### Props

```typescript
interface ThLoaderProps extends Omit<HTMLAttributesWithRef<HTMLDivElement>, "aria-busy" | "aria-live"> {
  ref?: React.ForwardedRef<HTMLDivElement>;
  isLoading: boolean;      // Controls loader visibility
  loader: ReactNode;       // Loading indicator content
}
```

### Features

- Automatic ARIA attributes management
- Conditional rendering of loader content
- Live region support for screen readers

## ThInteractiveOverlay

A component for creating interactive overlays e.g. tap/click zones, hover zones, etc.

### Props

```typescript
interface ThInteractiveOverlayProps extends HTMLAttributesWithRef<HTMLDivElement> {
  ref?: React.ForwardedRef<HTMLDivElement>;
  isActive: boolean;
}
```

### Features

- Conditional rendering of the invisible overlay
- Accepts all props from `HTMLAttributesWithRef<HTMLDivElement>`

## ThPagination

### Props

```typescript
interface ThPaginationProps extends HTMLAttributesWithRef<HTMLDivElement> {
  ref?: React.RefObject<HTMLDivElement>;
  direction?: "left" | "right";
  links?: {
    previous?: ThPaginationLinkProps;
    next?: ThPaginationLinkProps;
  };
  children?: React.ReactNode;
  compounds?: {
    listItem?: React.HTMLAttributes<HTMLLIElement>;
    previousButton?: Exclude<WithRef<ButtonProps, HTMLButtonElement>, "type"> | React.ReactElement<typeof Button>;
    nextButton?: Exclude<WithRef<ButtonProps, HTMLButtonElement>, "type"> | React.ReactElement<typeof Button>;
  };
}
```

### Features

- Semantic `<nav>` structure
- Directional arrow icon support
- Accessibility support
- Accepts a `links` prop to define the previous and next links, their icons and onPress handlers
- Accepts a `compounds` prop to define the previous and next buttons
- Accepts a `children` prop to define the content between the previous and next links

## ThProgression

A component for displaying reader progression.

### Props

```typescript
interface ThProgressionProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.RefObject<HTMLDivElement>
}
```

## ThRunningHead

A component for displaying the current running head in the top bar.

### Props

```typescript
interface ThRunningHeadProps extends HTMLAttributesWithRef<HTMLHeadingElement> {
  ref?: React.RefObject<HTMLHeadingElement>
  label: string;           // Heading text content
}
```

### Features

- Automatic document title synchronization
- Semantic heading structure
- Accessibility support

## Accessibility

All reader components implement ARIA best practices:

- Proper heading structure
- Live regions for dynamic content
- ARIA attributes for loading states
- Semantic HTML elements