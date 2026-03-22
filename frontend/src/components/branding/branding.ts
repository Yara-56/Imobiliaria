// branding.ts
import { BrandingCollection } from "./branding.types";

export const branding: BrandingCollection = {
  logoFull: {
    light: "/branding/logos/logo-full.png",
    dark: "/branding/logos/logo-full-dark.png",
    description: "Logo completa principal da HomeFlux",
    size: "240x72",
  },

  logoHorizontal: {
    light: "/branding/logos/logo-horizontal.png",
    dark: "/branding/logos/logo-horizontal-dark.png",
    description: "Logo horizontal utilizada em header e website",
    size: "220x56",
  },

  logoVertical: {
    light: "/branding/logos/logo-vertical.png",
    description: "Versão vertical para materiais institucionais",
    size: "180x180",
  },

  logoMinimal: {
    light: "/branding/logos/logo-minimal.png",
    description: "Versão minimalista para favicon e app",
    size: "64x64",
  },

  appIcon: {
    light: "/branding/logos/logo-app-icon.png",
    description: "Ícone quadrado usado no app e splashscreen",
    size: "512x512",
  },

  favicon: {
    light: "/branding/icons/favicon-512.png",
    description: "Favicon padrão para navegadores",
    size: "512x512",
  },

  emailHeader: {
    light: "/branding/email/header-email.png",
    description: "Header oficial para e-mails transacionais",
    size: "600x200",
  },

  topbarLogo: {
    light: "/branding/system/topbar-logo.png",
    dark: "/branding/system/topbar-logo-dark.png",
    description: "Logo utilizada na barra superior do dashboard",
    size: "140x40",
  },

  sidebarLogo: {
    light: "/branding/system/sidebar-logo.png",
    dark: "/branding/system/sidebar-logo-dark.png",
    description: "Logo principal da sidebar do admin",
    size: "160x48",
  },

  sidebarMini: {
    light: "/branding/system/sidebar-mini.png",
    description: "Mini versão usada na sidebar recolhida",
    size: "40x40",
  },

  notificationBadge: {
    light: "/branding/system/notification-badge.png",
    description: "Badge padrão para notificações internas",
    size: "24x24",
  },
};