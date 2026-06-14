export const navLinks = [
  { label: "Home", href: "#" },
  { label: "Projects", href: "#" },
  { label: "About Us", href: "#" },
] as const;

export const clients = [
  "Native Instruments,",
  "Oura,",
  "Hender Scheme,",
  "B&O Play,",
  "Nothing,",
  "Gentle Monster,",
  "Officine Panerai,",
  "Polestar,",
  "Fragment Design,",
  "Superfuture,",
  "Bang & Olufsen,",
  "Sonos.",
] as const;

export function getClientImage(index: number) {
  return `/images/lacrapulestudio-hover-animation/img${index + 1}.jpg`;
}
