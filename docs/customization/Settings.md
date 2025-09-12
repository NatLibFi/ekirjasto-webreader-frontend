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

## Zoom (optional)

The zoom object is responsible for the zoom/font-size Component. It accepts a `variant` from enum `ThSettingsRangeVariant`.

## Text (optional)

The text object is responsible for the advanced Text Component, which provides an extra container to display more options.

### Main (optional)

The `main` property accepts an array of `ThTextSettingsKeys`. These components will be displayed in the SettingsPanel, with a button to access the components in `displayOrder`.

If all nestable components are listed in `main`, then the Text component behaves as if all its nested components are standalone, and will not create a button to access them – as they are already accessible.

### SubPanel (optional)

The `subPanel` property accepts and array of the keys for components to display in the “sub-panel”, and their order. Note components listed in `main` will not automatically be added to this array.

## Spacing (optional)

The spacing object is responsible for the advanced Spacing Component, which provides an extra container to display more options.

### Main (optional)

The `main` property accepts an array of `ThSpacingSettingsKeys`. These components will be displayed in the SettingsPanel, with a button to access the components in `displayOrder`.

If all nestable components are listed in `main`, then the Spacing component behaves as if all its nested components are standalone, and will not create a button to access them – as they are already accessible.

### SubPanel (optional)

The `subPanel` property accepts and array of the keys for components to display in the “sub-panel”, and their order. Note components listed in `main` will not automatically be added to this array.

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