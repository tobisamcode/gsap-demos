export interface Product {
  name: string;
  img: string;
  price: number;
  tag: string;
  url: string;
}

export const products: Product[] = [
  {
    name: "Obsidian Puffer",
    img: "/images/damso-product-slider/product-1.png",
    price: 240,
    tag: "Outerwear",
    url: "https://store.example.com/obsidian-puffer",
  },
  {
    name: "Slate Joggers",
    img: "/images/damso-product-slider/product-2.png",
    price: 160,
    tag: "Essentials",
    url: "https://store.example.com/slate-joggers",
  },
  {
    name: "Noir Shirt",
    img: "/images/damso-product-slider/product-3.png",
    price: 190,
    tag: "Classic",
    url: "https://store.example.com/noir-shirt",
  },
  {
    name: "Ash Knit",
    img: "/images/damso-product-slider/product-4.png",
    price: 220,
    tag: "Core Piece",
    url: "https://store.example.com/ash-knit",
  },
  {
    name: "Form Jacket",
    img: "/images/damso-product-slider/product-5.png",
    price: 280,
    tag: "Minimal",
    url: "https://store.example.com/form-jacket",
  },
  {
    name: "Carbon Trousers",
    img: "/images/damso-product-slider/product-6.png",
    price: 210,
    tag: "Tailored",
    url: "https://store.example.com/carbon-trousers",
  },
  {
    name: "Edge Vest",
    img: "/images/damso-product-slider/product-7.png",
    price: 150,
    tag: "Layer",
    url: "https://store.example.com/edge-vest",
  },
  {
    name: "Grain Tee",
    img: "/images/damso-product-slider/product-8.png",
    price: 130,
    tag: "Everyday",
    url: "https://store.example.com/grain-tee",
  },
  {
    name: "Stone Cap",
    img: "/images/damso-product-slider/product-9.png",
    price: 95,
    tag: "Accessory",
    url: "https://store.example.com/stone-cap",
  },
  {
    name: "Void Coat",
    img: "/images/damso-product-slider/product-10.png",
    price: 310,
    tag: "Statement",
    url: "https://store.example.com/void-coat",
  },
];

export const BUFFER_SIZE = 5;
export const SLIDE_WIDTH = 0.375 * 1000;

export function getProductIndex(
  relativeIndex: number,
  currentProductIndex: number
) {
  const len = products.length;
  return (
    (((currentProductIndex + relativeIndex) % len) + len) % len
  );
}

export function createInitialSlides(currentProductIndex = 0) {
  return Array.from({ length: BUFFER_SIZE * 2 + 1 }, (_, i) => {
    const relativeIndex = i - BUFFER_SIZE;
    return {
      id: `slide-${relativeIndex}-${crypto.randomUUID()}`,
      relativeIndex,
      productIndex: getProductIndex(relativeIndex, currentProductIndex),
    };
  });
}
