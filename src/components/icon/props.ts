export const ICON_NAMES = [
  "mc-clock",
  "mc-earth",
  "mc-laptop",
  "mc-inbox",
  "mc-message",
  "mc-moon",
  "mc-sun",
  "mc-fingerprint",
  "mc-language",
  "mc-code",
  "mc-redirect",
  "mc-arrow-rotate",
  "mc-arrows-rotate",
  "mc-arrow-down",
  "mc-arrow-left",
  "mc-arrow-right",
  "mc-arrow-up",
  "mc-chevron-down",
  "mc-chevron-left",
  "mc-chevron-right",
  "mc-chevron-up",
  "mc-x"
] as const;

export type IconName = (typeof ICON_NAMES)[number];