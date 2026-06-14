export const overviewParagraphs = [
  {
    index: "1.",
    text: "My GSAP Demo is a curated collection of motion experiments built on precision, timing, and interaction. Each demo explores how animation can guide attention, add depth to layout, and turn static interfaces into something that feels alive.",
  },
  {
    index: "2.",
    text: "From scroll-triggered sequences and text reveals to hover effects, pinned sections, and 3D work, the app spans different GSAP techniques across standalone routes. Every page is a self-contained prototype — a way to test ideas, study motion craft, and see what great animation can do on the web.",
  },
] as const;

export interface DemoLink {
  label: string;
  href: string;
  image: string;
}

export const demoLinks: DemoLink[] = [
  { label: "Spotlight", href: "/spotlight" },
  { label: "Griflan Hover Effect", href: "/griflan-hover-effect" },
  { label: "Damso Product Slider", href: "/damso-product-slider" },
  {
    label: "Landonorris Interactive Landing Page",
    href: "/landonorris-interactive-landing-page",
  },
  { label: "Sticky Cards", href: "/sticky-cards" },
  {
    label: "Terminal Text Reveal Animation",
    href: "/terminal-text-reveal-animation",
  },
  {
    label: "Ashleybrookecs Smudge Revealer",
    href: "/ashleybrookecs-smudge-revealer",
  },
  {
    label: "Scroll Activated Text Blocks",
    href: "/scroll-activated-text-blocks",
  },
  {
    label: "Spencergabor Magnetic Cards",
    href: "/spencergabor-magnetic-cards",
  },
  {
    label: "Split Card Scroll Animation",
    href: "/split-card-scroll-animation",
  },
  { label: "Text Reveal Animation", href: "/text-reveal-animation" },
  {
    label: "Davidalaba Landing Page Reveal",
    href: "/davidalaba-landing-page-reveal",
  },
  { label: "Poly App Photo Dump", href: "/poly-app-photo-dump" },
  {
    label: "Lacrapulestudio Hover Animation",
    href: "/lacrapulestudio-hover-animation",
  },
  { label: "Wonjyou Horizontal Scroll", href: "/wonjyou-horizontal-scroll" },
  {
    label: "Push Over Overlay Menu",
    href: "/push-over-overlay-menu",
  },
  {
    label: "Contact SVG Eyes",
    href: "/contact-svg-eyes",
  },
  {
    label: "Overlay Menu GSAP",
    href: "/overlay-menu-gsap",
  },
  {
    label: "AudemarsPiguet Menu",
    href: "/audemarspiguet-menu",
  },
  {
    label: "NakedCity Scroll Animation",
    href: "/nakedcityfilms-scroll-animation",
  },
  {
    label: "Silver-Pinewood 3D Menu",
    href: "/silver-pinewood-menu",
  },
  {
    label: "Jam Area Menu",
    href: "/jamarea-menu",
  },
  {
    label: "ExoApe Overlay Menu",
    href: "/exoape-menu",
  },
  {
    label: "Akaru Menu",
    href: "/akaru-menu",
  },
  {
    label: "KPVERSE Menu",
    href: "/kpverse-menu",
  },
].map((demo) => ({
  ...demo,
  image: `/images/home${demo.href}.png`,
}));
