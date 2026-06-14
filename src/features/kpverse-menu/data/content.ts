export const navToggleLabel = "Menu";
export const navRightLabel = "Collection";

export const menuTopTitle = "discover";

export interface MenuItem {
  label: string;
  meta: string;
  active?: boolean;
}

export const menuItems: MenuItem[] = [
  { label: "story", meta: "page 001" },
  { label: "Protocol", meta: "20 ideas" },
  { label: "journal", meta: "10 notes" },
  { label: "contact", meta: "email now" },
  { label: "gallery", meta: "check out", active: true },
  { label: "about", meta: "our office" },
];

export interface MenuSubItem {
  title: string;
  content: string;
}

export const menuSubItems: MenuSubItem[] = [
  { title: "connect", content: "Discord" },
  { title: "buy On", content: "Opensea" },
  { title: "us-en", content: "2022" },
];
