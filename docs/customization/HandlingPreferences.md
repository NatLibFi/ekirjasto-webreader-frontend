# Handling Preferences

In case you need to use the Preferences package, you can use the following helpers to create and merge preferences objects.

It also provides a `PreferencesProvider` component that makes the preferences available to all components, as well as a context hook, `usePreferences()`, that allows you to access and update the preferences.

## Create Preferences

The `createPreferences` helper allows you to create a new preferences object with your own custom configuration. This is the primary way to set up the preferences for your Thorium Web implementation.

```
const myPreferences = createPreferences({
  direction: ThLayoutDirection.ltr,
  locale: "en-US",
  typography: {
    optimalLineLength: 65,
    pageGutter: 20
  },
  // ... other preference settings
});
```

The function accepts a single parameter, `params`, which is a `ThPreferences<T>` object containing all your custom preferences.

`T` is an optional type parameter that extends `Partial<CustomizableKeys>`. This allows you to customize the enum types used for various settings (actions, themes, etc.), although type inference should work most of the time.

It returns a new `ThPreferences<T>` object with all the properties you provided.

You can extend the default keys with your own custom keys like this:

```
import { createPreferences, ThPreferences } from "@edrlab/thorium-web/preferences";

// Define custom action keys
enum MyCustomActionKeys {
  fullscreen = "fullscreen",
  settings = "settings",
  toc = "toc",
  myCustomAction = "myCustomAction" // Custom action
}

// Create preferences with custom keys
const myPreferences = createPreferences({
  // ... other preferences
  actions: {
    //... other action props
    reflowOrder: [
      MyCustomActionKeys.settings,
      MyCustomActionKeys.toc,
      MyCustomActionKeys.myCustomAction,
      MyCustomActionKeys.fullscreen
    ],
    collapse: {
      // ... collapse settings
    },
    keys: {
      // Configure each action key
      [MyCustomActionKeys.myCustomAction]: {
        visibility: "always",
        shortcut: null,
        // ... other action settings
      },
      // ... other action keys
    }
  }
});
```

Notes: 

- This function simply returns the object you pass to it, preserving all properties
- Use this function to ensure type safety when creating preferences

## Preferences Provider

The `ThPreferencesProvider` component provides a React context for accessing Thorium Web preferences throughout your application. It serves as the central point for managing and distributing preference settings to all components.

```
// Create custom preferences
const myPreferences = createPreferences({
  direction: ThLayoutDirection.ltr,
  locale: "en-US",
  // ... other preference settings
});

function App() {
  return (
    <ThPreferencesProvider value={myPreferences}>
      {/* Your application components */}
    </ThPreferencesProvider>
  );
}
```

The component accepts two props:

- `value` (optional): A `ThPreferences` object containing your custom preferences. If not provided, the default preferences will be used.
- `children` : React nodes that will have access to the preferences context.

`T` is an optional type parameter that extends `ThPreferences`. This allows you to use custom preference types with proper type safety.

Components can then access the preferences using the `usePreferences` hook:

```
function MyComponent() {
  const { preferences, update } = usePreferences();
  
  // Now you can use preferences
  const { direction, locale } = preferences;
  
  return (
    // Your component implementation
  );
}
```

Notes: 

- The provider should be placed high in your component tree to ensure all components have access to the preferences
- You can nest multiple providers to override preferences for specific parts of your application