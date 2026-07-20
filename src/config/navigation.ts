export type NavItem = {
  /** i18n key: navHome, navGranth, navAsk, navAbout */
  key: "navHome" | "navGranth" | "navAsk" | "navAbout";
  label: string;
  href: string;
};

export const navigationItems: NavItem[] = [
  { key: "navHome",   label: "Home",           href: "/" },
  { key: "navGranth", label: "Akas Granth",    href: "/granth" },
  { key: "navAsk",    label: "Jigyasa Engine", href: "/ask" },
  { key: "navAbout",  label: "About",          href: "/about" },
];
