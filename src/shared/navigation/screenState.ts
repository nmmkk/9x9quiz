export const screenIds = {
  title: "title",
  modeSelect: "mode-select",
  quiz: "quiz",
} as const;

export type ScreenId = (typeof screenIds)[keyof typeof screenIds];

export const initialScreen: ScreenId = screenIds.title;
