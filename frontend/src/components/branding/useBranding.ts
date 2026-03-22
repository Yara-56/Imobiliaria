// useBranding.ts
import { branding } from "./branding";

type ColorMode = "light" | "dark";

export const useBranding = (colorMode: ColorMode = "light") => {
  const get = (key: keyof typeof branding) => {
    const asset = branding[key];
    return colorMode === "dark" && asset.dark ? asset.dark : asset.light;
  };

  const getAsset = (key: keyof typeof branding) => branding[key];

  return {
    get,
    getAsset,
    branding,
  };
};