// branding.types.ts
export interface BrandingAsset {
    light: string;
    dark?: string;
    description: string;
    size?: string;
  }
  
  export interface BrandingCollection {
    logoFull: BrandingAsset;
    logoHorizontal: BrandingAsset;
    logoVertical: BrandingAsset;
    logoMinimal: BrandingAsset;
    appIcon: BrandingAsset;
    favicon: BrandingAsset;
    emailHeader: BrandingAsset;
    topbarLogo: BrandingAsset;
    sidebarLogo: BrandingAsset;
    sidebarMini: BrandingAsset;
    notificationBadge: BrandingAsset;
  }