import { ThSettingsRangePlaceholder } from "@/preferences";

import { useI18n } from "@/i18n/useI18n";

export const usePlaceholder = (
  placeholder: ThSettingsRangePlaceholder | string | { key: string; fallback?: string } | undefined,
  range: [number, number]
): string | undefined => {
  const { t } = useI18n();

  if (!placeholder) {
    return undefined;
  }

  // Handle enum values
  if (placeholder === ThSettingsRangePlaceholder.none) {
    return undefined;
  }
  if (placeholder === ThSettingsRangePlaceholder.range) {
    return `${range[0]} - ${range[1]}`;
  }

  // Handle i18n object
  if (typeof placeholder === "object" && "key" in placeholder) {
    const translatedPlaceholder = t(placeholder.key);
    return translatedPlaceholder !== placeholder.key ? translatedPlaceholder : placeholder.fallback;
  }

  // Handle string values (literal text, not translated)
  if (typeof placeholder === "string") {
    return placeholder;
  }

  return undefined;
};