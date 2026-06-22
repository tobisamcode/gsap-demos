const imageBase = "/images/magnetic-marquee";

export const navLeft = "hello@codegrid.com";
export const navRight = "Instagram, YouTube, X";

export const title = "CG Studio";
export const subtitle = "Making stuff others try to copy";

export const copy = [
  "Codegrid explores web design, animation, and front end development through practical tutorials and detailed walkthroughs. Every video is created to help developers build engaging and memorable digital experiences.",
  "From GSAP animations and interactive interfaces to complete website builds, the channel focuses on creative techniques, clean code, and thoughtful processes that can be applied to real projects.",
];

export const footer =
  "Codegrid is dedicated to exploring the craft of modern web development through tutorials, creative experiments, and in depth project breakdowns. From animation and interaction design to front end development, every video is created to inspire curiosity, encourage learning, and help developers build better experiences for the web.";

export const marqueeImages = Array.from(
  { length: 6 },
  (_, i) => `${imageBase}/marquee-img-${i + 1}.jpg`,
);
