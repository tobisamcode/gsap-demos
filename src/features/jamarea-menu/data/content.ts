export const navToggleLabel = "Menu";
export const navItemLabel = "Archive";

export const heroHeading = "Shaping Ideas";

export const menuImage = "/images/jamarea-menu/menu_img.jpg";

export interface MenuInfoColumn {
  blocks: string[][];
  spacer: number;
  align: "left" | "right";
}

export const menuInfoColumns: MenuInfoColumn[] = [
  {
    align: "left",
    spacer: 1,
    blocks: [
      ["Codegrid", "Shoreline Drive", "Oslo"],
      ["Edition", "Vol. 03"],
      ["Contact", "hello@codegrid.com"],
      ["Direct", "+47 1234 567890"],
    ],
  },
  {
    align: "right",
    spacer: 2,
    blocks: [
      ["Instagram", "Are.na", "Vimeo"],
      ["Language", "Norsk"],
      ["Credits", "Imprint", "Ref. 00492X"],
    ],
  },
];

export const menuLinks = ["Index", "Persona", "Biography", "Work", "Journal"];
