import { PRIMARY_COLORS, FONT_OPTIONS } from "./defaults";

const COLOR_RGB = {
  emerald: "16 185 129",
  blue: "59 130 246",
  violet: "139 92 246",
  orange: "249 115 22",
  rose: "244 63 94",
};

export function applyThemeSettings(theme, darkMode) {
  const rgb = COLOR_RGB[theme?.primaryColor] || COLOR_RGB.emerald;
  document.documentElement.style.setProperty("--admin-primary", rgb);
  document.documentElement.classList.toggle("dark", darkMode);
  document.documentElement.classList.toggle("sidebar-collapsed", !!theme?.sidebarCollapsed);

  const font = FONT_OPTIONS.find((f) => f.id === theme?.fontFamily) || FONT_OPTIONS[0];
  document.documentElement.style.setProperty("--admin-font-family", font.family);
  const wrap = document.querySelector(".admin-wrap");
  if (wrap) wrap.style.fontFamily = font.family;
}

export function applyBranding(general) {
  if (general?.favicon) {
    let link = document.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = general.favicon;
  }
}

export function getPrimaryHex(colorId) {
  return PRIMARY_COLORS.find((c) => c.id === colorId)?.hex || "#10b981";
}
