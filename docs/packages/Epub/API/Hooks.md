# Hooks API Reference

## usePublication

The `usePublication` hook is a custom hook that provides a way to fetch the Readium Web Publication Manifest from a given URL. It returns the manifest data and a self-link the `StatefulReader` component uses to load and navigate the publication.

The `onError` callback is an optional callback that is called with the error message if the fetch fails.

```typescript
interface UsePublicationOptions {
  url: string;
  onError?: (error: string) => void;
}
```

Features:
- Fetches the Readium Web Publication Manifest from a given URL
- Extracts the self-link from the manifest
- Error handling