const imageBase = "/images/exoape-menu";

export const logoLabel = "Void Construct";

export const heroHeading = "Digital architecture that rises from the void.";
export const heroImage = `${imageBase}/hero.jpg`;

export const previewDefaultImage = `${imageBase}/img-1.jpg`;

export interface MenuLink {
  label: string;
  href: string;
  image: string;
}

export const menuLinks: MenuLink[] = [
  { label: "Visions", href: "#", image: `${imageBase}/img-1.jpg` },
  { label: "Core", href: "#", image: `${imageBase}/img-2.jpg` },
  { label: "Signals", href: "#", image: `${imageBase}/img-3.jpg` },
  { label: "Connect", href: "#", image: `${imageBase}/img-4.jpg` },
];

export const menuSocials = [
  { label: "Behance", href: "#" },
  { label: "Dribbble", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Instagram", href: "#" },
];

export const footerPrimary = { label: "Run Sequence", href: "#" };

export const footerSecondary = [
  { label: "Origin", href: "#" },
  { label: "Join Signal", href: "#" },
];
