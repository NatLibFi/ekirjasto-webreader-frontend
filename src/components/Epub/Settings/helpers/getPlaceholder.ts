import { ThSettingsRangePlaceholder } from "@/preferences";

export const getPlaceholder = (placeholder: ThSettingsRangePlaceholder | string | undefined, range: [number, number]): string | undefined => {
  if (!placeholder || placeholder === ThSettingsRangePlaceholder.none) {
    return undefined;
  }
  if (placeholder === ThSettingsRangePlaceholder.range) {
    return `${range[0]} - ${range[1]}`;
  }
  return placeholder;
};