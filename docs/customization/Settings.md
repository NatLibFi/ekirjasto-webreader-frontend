# Settings

Settings can be customized extensively, and even nested in advanced components. The values for some settings can be customized as well.

## Display Order

You can customize the order of the actions in the `reflowOrder` or `fxlOrder` arrays, and remove them as well if you don’t want to expose some. 

Enum `ThSettingsKeys` is provided to keep things consistent across the entire codebase.

For instance:

```
settings: {
  ...
  reflowOrder: [
    ThSettingsKeys.zoom,
    ThSettingsKeys.fontFamily,
    ThSettingsKeys.theme,
    ThSettingsKeys.lineHeight,
    ThSettingsKeys.layout,
    ThSettingsKeys.columns
  ],
  fxlOrder: [
    ThSettingsKeys.zoom,
    ThSettingsKeys.theme,
    ThSettingsKeys.columns
  ]
}
```

Note that if you are using a standalone component in an Advanced component (either in `main` or `displayOrder`), it will be filtered so that it is not rendered twice.

### Standalone components

All settings components are standalone by default, which means you can organise them as you see fit to build your own Settings panel.

### Advanced components

`ThSettingsKeys.text` and `ThSettingsKeys.spacing` are two advanced components in which you can nest other components.

Enums `ThTextSettingsKeys` and `ThSpacingSettingsKeys` list which components can be nested in these two.

When used, a button will be added to access the nested components.


## Keys

The `keys` object is used to configure range settings:

- `letterSpacing`;
- `paragraphIndent`;
- `paragraphSpacing`;
- `wordSpacing`;
- `zoom`.

These ranges expect:

- `variant` (optional): from enum `ThSettingsRangeVariant` (`slider`, `incrementedSlider` or `numberfield`)
- `range` (optional): the min and max values, as `[number, number]`
- `step` (optional): the step value, as `number`

It also allows you to configure `lineHeight`, where the keys are `ThLineHeightKeys` and value is a number.

It also allows you to configure `margin`, where the keys are `ThMarginOptions` and value is a number.

## Configuration Example

```typescript
settings: {
  reflowOrder: [
    ThSettingsKeys.zoom,
    ThSettingsKeys.textGroup,
    ThSettingsKeys.theme,
    ThSettingsKeys.spacingGroup,
    ThSettingsKeys.layout,
    ThSettingsKeys.columns
  ],
  fxlOrder: [
    ThSettingsKeys.theme,
    ThSettingsKeys.columns
  ],
  keys: {
    [ThSettingsKeys.letterSpacing]: {
      variant: ThSettingsRangeVariant.slider,
      range: [0, 0.5],
      step: 0.05
    },
    [ThSettingsKeys.wordSpacing]: {
      variant: ThSettingsRangeVariant.numberField,
      range: [0, 1],
      step: 0.1
    },
    [ThSettingsKeys.zoom]: {
      variant: ThSettingsRangeVariant.numberField,
      range: [0.7, 4],
      step: 0.05
    },
    [ThSettingsKeys.lineHeight]: {
      [ThLineHeightOptions.small]: 1.3,
      [ThLineHeightOptions.medium]: 1.5,
      [ThLineHeightOptions.large]: 1.75
    },
    [ThSettingsKeys.margin]: {
      [ThMarginOptions.small]: 1.25,
      [ThMarginOptions.medium]: 1,
      [ThMarginOptions.large]: 0.75
    }
  },
  text: {
    main: [ThTextSettingsKeys.fontFamily],
    subPanel: [
      ThTextSettingsKeys.fontFamily,
      ThTextSettingsKeys.fontWeight,
      ThTextSettingsKeys.textAlign,
      ThTextSettingsKeys.hyphens,
      ThTextSettingsKeys.textNormalize
    ]
  },
  spacing: {
    main: [ThSpacingSettingsKeys.spacingPresets],
    subPanel: [
      ThSpacingSettingsKeys.spacingPresets,
      ThSpacingSettingsKeys.margin,
      ThSpacingSettingsKeys.lineHeight,
      ThSpacingSettingsKeys.wordSpacing,
      ThSpacingSettingsKeys.letterSpacing,
      ThSpacingSettingsKeys.paragraphSpacing,
      ThSpacingSettingsKeys.paragraphIndent
    ]
  }
}
```

## Text (optional)

The text object is responsible for the advanced Text Component, which provides an extra container to display more options.

### Main (optional)

The `main` property accepts an array of `ThTextSettingsKeys`. These components will be displayed in the SettingsPanel, with a button to access the components in `displayOrder`.

If all nestable components are listed in `main`, then the Text component behaves as if all its nested components are standalone, and will not create a button to access them – as they are already accessible.

### SubPanel (optional)

The `subPanel` property accepts and array of the keys for components to display in the “sub-panel”, and their order. Note components listed in `main` will not automatically be added to this array.

### Header (optional)

The `header` property accepts a `ThSheetHeaderVariant` to display a header in the SettingsPanel.

## Spacing (optional)

The spacing object is responsible for the advanced Spacing Component, which provides an extra container to display more options.

### Main (optional)

The `main` property accepts an array of `ThSpacingSettingsKeys`. These components will be displayed in the SettingsPanel, with a button to access the components in `displayOrder`.

If all nestable components are listed in `main`, then the Spacing component behaves as if all its nested components are standalone, and will not create a button to access them – as they are already accessible.

### SubPanel (optional)

The `subPanel` property accepts and array of the keys for components to display in the “sub-panel”, and their order. Note components listed in `main` will not automatically be added to this array.

### Header (optional)

The `header` property accepts a `ThSheetHeaderVariant` to display a header in the SettingsPanel.

### Presets (optional)

The `presets` property accepts an object with the following properties:

- `reflowOrder`: an array of `ThSpacingPresetKeys` to display in the SettingsPanel, in the order they are listed;
- `keys`: an object with the presets and their configurations.

For instance:

```typescript
...
spacing:
  ...
  presets: {
    reflowOrder: [
      ThSpacingPresetKeys.publisher,
      ThSpacingPresetKeys.accessible,
      ThSpacingPresetKeys.custom,
      ThSpacingPresetKeys.tight,
      ThSpacingPresetKeys.balanced,
      ThSpacingPresetKeys.loose
    ],
    keys: {
      [ThSpacingPresetKeys.tight]: {
        [ThSettingsKeys.lineHeight]: ThLineHeightOptions.small,
        [ThSettingsKeys.margin]: ThMarginOptions.small,
        [ThSettingsKeys.paragraphSpacing]: 0,
        [ThSettingsKeys.paragraphIndent]: 1
      },
      [ThSpacingPresetKeys.balanced]: {
        [ThSettingsKeys.lineHeight]: ThLineHeightOptions.medium,
        [ThSettingsKeys.margin]: ThMarginOptions.medium
      },
      [ThSpacingPresetKeys.loose]: {
        [ThSettingsKeys.lineHeight]: ThLineHeightOptions.large,
        [ThSettingsKeys.margin]: ThMarginOptions.medium,
        [ThSettingsKeys.paragraphSpacing]: 1.5
      },
      [ThSpacingPresetKeys.accessible]: {
        [ThSettingsKeys.lineHeight]: ThLineHeightOptions.large,
        [ThSettingsKeys.margin]: ThMarginOptions.large,
        [ThSettingsKeys.paragraphSpacing]: 3,
        [ThSettingsKeys.paragraphIndent]: 0,
        [ThSettingsKeys.letterSpacing]: 0.1,
        [ThSettingsKeys.wordSpacing]: 0.3
      }
    }
  }
}
```

#### Display Order

The `reflowOrder` array controls the display order of spacing presets in the settings panel. Presets not included in this array will not be available to users.

Note that `ThSpacingPresetKeys.publisher` and `ThSpacingPresetKeys.custom` are special presets that do not accept configuration in the `keys` object:
- `ThSpacingPresetKeys.publisher` uses the original publisher's spacing settings
- `ThSpacingPresetKeys.custom` allows users to customize their own preset through the UI

#### Keys

The `keys` object contains the spacing presets (excluding `ThSpacingPresetKeys.publisher` and `ThSpacingPresetKeys.custom`) and their configurations. Each preset can configure the following settings:

- `ThSettingsKeys.lineHeight` - Controls line spacing using `ThLineHeightOptions` (small, medium, large)
- `ThSettingsKeys.margin` - Page margins using `ThMarginOptions` (small, medium, large)
- `ThSettingsKeys.paragraphSpacing` - Space between paragraphs (number value)
- `ThSettingsKeys.paragraphIndent` - First line indentation (number value)
- `ThSettingsKeys.letterSpacing` - Space between letters (number value)
- `ThSettingsKeys.wordSpacing` - Space between words (number value)