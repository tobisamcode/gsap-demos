"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import {
  footerText,
  handLeft,
  handRight,
  headerWords,
  navLinks,
  sections,
} from "@/features/lukebaffait-animated-footer/data/content";

gsap.registerPlugin(ScrollTrigger, SplitText);

const ASCII_CHARS = "........:::=+xX#0369";
const FONT_SIZE = 18;
const CELL_SIZE = 20;
const ASCII_COLUMNS = 80;
const DPR = 2;

const CHAR_COLOR = "#803500";
const HOVER_COLOR = "#ff6a00";
const HOVER_CHAR_COLOR = "#0f0f0f";

const HOVER_RADIUS = 8;
const CLUSTER_SIZE = 10;
const HIGHLIGHT_LIFETIME = 300;

const PARALLAX_STRENGTH = 20;
const PARALLAX_EASE = 0.05;

const backgroundCharIndex = ASCII_CHARS.lastIndexOf(".");

interface Cell {
  col: number;
  row: number;
  char: string;
  highlightEndTime: number;
}

interface Hand {
  canvas: HTMLCanvasElement;
  cells: Map<string, Cell>;
  cellList: Cell[];
  rows: number;
}

export default function LukebaffaitAnimatedFooter() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    const rafIds: number[] = [];
    const splits: SplitText[] = [];
    const scrollTriggers: ScrollTrigger[] = [];

    const sampleImagePixels = (image: HTMLImageElement, gridRows: number) => {
      const canvas = document.createElement("canvas");
      canvas.width = ASCII_COLUMNS;
      canvas.height = gridRows;

      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(image, 0, 0, ASCII_COLUMNS, gridRows);
      return ctx.getImageData(0, 0, ASCII_COLUMNS, gridRows).data;
    };

    const pixelToCharIndex = (pixels: Uint8ClampedArray, pixelOffset: number) => {
      const brightness =
        (pixels[pixelOffset] * 0.299 +
          pixels[pixelOffset + 1] * 0.587 +
          pixels[pixelOffset + 2] * 0.114) /
        255;

      return Math.min(
        ASCII_CHARS.length - 1,
        Math.floor((1 - brightness) * ASCII_CHARS.length),
      );
    };

    const buildCells = (image: HTMLImageElement) => {
      const rows = Math.round(
        ASCII_COLUMNS / (image.naturalWidth / image.naturalHeight),
      );
      const pixels = sampleImagePixels(image, rows);
      const cells = new Map<string, Cell>();

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < ASCII_COLUMNS; col++) {
          const charIndex = pixelToCharIndex(
            pixels,
            (row * ASCII_COLUMNS + col) * 4,
          );
          if (charIndex <= backgroundCharIndex) continue;

          cells.set(`${col},${row}`, {
            col,
            row,
            char: ASCII_CHARS[charIndex],
            highlightEndTime: 0,
          });
        }
      }

      return { rows, cells };
    };

    const setupHand = (image: HTMLImageElement): Hand | null => {
      const { rows, cells } = buildCells(image);
      const cellList = [...cells.values()];

      const wrapper = image.closest(".lbf-footer-hand-img");
      const canvas = wrapper?.querySelector("canvas");
      if (!canvas) return null;

      canvas.width = ASCII_COLUMNS * CELL_SIZE * DPR;
      canvas.height = rows * CELL_SIZE * DPR;

      const ctx = canvas.getContext("2d")!;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.font = `${FONT_SIZE}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";

      const metrics = ctx.measureText("X");
      const glyphHeight =
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      const baselineOffset =
        CELL_SIZE / 2 + glyphHeight / 2 - metrics.actualBoundingBoxDescent;

      const canvasWidth = ASCII_COLUMNS * CELL_SIZE;
      const canvasHeight = rows * CELL_SIZE;

      const render = () => {
        if (cancelled) return;
        const now = Date.now();
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        for (const cell of cellList) {
          const x = cell.col * CELL_SIZE;
          const y = cell.row * CELL_SIZE;
          const isHighlighted = cell.highlightEndTime > now;

          if (isHighlighted) {
            ctx.fillStyle = HOVER_COLOR;
            ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
          }

          ctx.fillStyle = isHighlighted ? HOVER_CHAR_COLOR : CHAR_COLOR;
          ctx.fillText(cell.char, x + CELL_SIZE / 2, y + baselineOffset);
        }

        rafIds.push(requestAnimationFrame(render));
      };

      render();

      return { canvas, cells, cellList, rows };
    };

    const hands: Hand[] = [];
    root.querySelectorAll<HTMLImageElement>("img.lbf-ascii-hand").forEach(
      (image) => {
        const start = () => {
          if (cancelled) return;
          const hand = setupHand(image);
          if (hand) hands.push(hand);
        };
        if (image.complete && image.naturalWidth) start();
        else image.addEventListener("load", start);
      },
    );

    const highlightCluster = (cells: Map<string, Cell>, startCell: Cell) => {
      const now = Date.now();
      startCell.highlightEndTime = now + HIGHLIGHT_LIFETIME;

      const steps = Math.floor(Math.random() * CLUSTER_SIZE) + 1;
      const litCells = [startCell];
      let current = startCell;

      for (let step = 0; step < steps; step++) {
        const neighbours: Cell[] = [];
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const neighbour = cells.get(`${current.col + dx},${current.row + dy}`);
            if (neighbour && !litCells.includes(neighbour))
              neighbours.push(neighbour);
          }
        }
        if (neighbours.length === 0) break;

        const next = neighbours[Math.floor(Math.random() * neighbours.length)];
        next.highlightEndTime = now + HIGHLIGHT_LIFETIME + step * 10;
        litCells.push(next);
        current = next;
      }
    };

    const hoverHand = (hand: Hand, clientX: number, clientY: number) => {
      const rect = hand.canvas.getBoundingClientRect();
      const mouseCol = ((clientX - rect.left) / rect.width) * ASCII_COLUMNS;
      const mouseRow = ((clientY - rect.top) / rect.height) * hand.rows;

      let closest: Cell | null = null;
      let closestDist = Infinity;
      for (const cell of hand.cellList) {
        const dx = mouseCol - cell.col;
        const dy = mouseRow - cell.row;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < closestDist) {
          closestDist = dist;
          closest = cell;
        }
      }

      if (closest && closestDist <= HOVER_RADIUS) {
        highlightCluster(hand.cells, closest);
      }
    };

    const handleHoverMove = (event: MouseEvent) => {
      hands.forEach((hand) => hoverHand(hand, event.clientX, event.clientY));
    };
    window.addEventListener("mousemove", handleHoverMove);

    const footer = root.querySelector("footer")!;
    const handWrappers = [
      ...root.querySelectorAll<HTMLElement>(".lbf-footer-hand-img"),
    ];

    const parallaxScale = 1 + (PARALLAX_STRENGTH * 2) / 200;

    const pointer = { x: 0, y: 0 };
    const drift = { x: 0, y: 0 };
    const reveal = { left: -125, right: 125 };

    const setPointerTarget = (clientX: number, clientY: number) => {
      const rect = footer.getBoundingClientRect();
      pointer.x =
        ((clientX - rect.left) / rect.width - 0.5) * PARALLAX_STRENGTH * 2;
      pointer.y =
        ((clientY - rect.top) / rect.height - 0.5) * PARALLAX_STRENGTH * 2;
    };

    const renderParallax = () => {
      if (cancelled) return;
      drift.x += (pointer.x - drift.x) * PARALLAX_EASE;
      drift.y += (pointer.y - drift.y) * PARALLAX_EASE;

      handWrappers.forEach((wrapper, i) => {
        const direction = i === 0 ? 1 : -1;
        const revealX = i === 0 ? reveal.left : reveal.right;
        const x = drift.x * direction;
        const y = -drift.y;
        wrapper.style.transform = `translate(calc(${x}px + ${revealX}%), ${y}px) scale(${parallaxScale})`;
      });

      rafIds.push(requestAnimationFrame(renderParallax));
    };
    renderParallax();

    const handleParallaxMove = (event: MouseEvent) => {
      setPointerTarget(event.clientX, event.clientY);
    };
    window.addEventListener("mousemove", handleParallaxMove);

    const splitHeadingChars = () => {
      const headings = root.querySelectorAll(".lbf-footer-header h1");
      const chars: Element[] = [];

      headings.forEach((heading) => {
        const split = SplitText.create(heading as HTMLElement, {
          type: "chars",
          charsClass: "lbf-char",
        });
        splits.push(split);
        chars.push(...split.chars);
      });

      gsap.set(chars, { position: "relative", yPercent: 125 });
      return chars;
    };

    const splitContentLines = () => {
      const elements = root.querySelectorAll(
        ".lbf-footer-links a, .lbf-footer-text p",
      );
      const lines: Element[] = [];

      elements.forEach((element) => {
        const split = SplitText.create(element as HTMLElement, {
          type: "lines",
          mask: "lines",
          linesClass: "lbf-line",
        });
        splits.push(split);
        lines.push(...split.lines);
      });

      gsap.set(lines, { yPercent: 100 });
      return lines;
    };

    const headingChars = splitHeadingChars();
    const contentLines = splitContentLines();

    const charStagger = { each: 0.04, from: "center" as const };

    const animateIn = () => {
      gsap.to(reveal, {
        left: 0,
        right: 0,
        duration: 1,
        ease: "power3.out",
        overwrite: true,
      });
      gsap.to(headingChars, {
        yPercent: 0,
        duration: 1,
        ease: "power3.out",
        stagger: charStagger,
        overwrite: true,
      });
      gsap.to(contentLines, {
        yPercent: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.08,
        overwrite: true,
      });
    };

    const animateOut = () => {
      gsap.to(reveal, {
        left: -125,
        right: 125,
        duration: 0.4,
        ease: "power2.in",
        overwrite: true,
      });
      gsap.to(headingChars, {
        yPercent: 125,
        duration: 0.4,
        ease: "power2.in",
        stagger: { each: 0.01, from: "center" },
        overwrite: true,
      });
      gsap.to(contentLines, {
        yPercent: 100,
        duration: 0.4,
        ease: "power2.in",
        stagger: 0.02,
        overwrite: true,
      });
    };

    const revealer = root.querySelector(".lbf-footer-revealer")!;

    scrollTriggers.push(
      ScrollTrigger.create({
        trigger: revealer,
        start: "top 50%",
        onEnter: animateIn,
      }),
    );

    scrollTriggers.push(
      ScrollTrigger.create({
        trigger: revealer,
        start: "top 85%",
        onLeaveBack: animateOut,
      }),
    );

    return () => {
      cancelled = true;
      rafIds.forEach((id) => cancelAnimationFrame(id));
      window.removeEventListener("mousemove", handleHoverMove);
      window.removeEventListener("mousemove", handleParallaxMove);
      scrollTriggers.forEach((trigger) => trigger.kill());
      splits.forEach((split) => split.revert());
    };
  }, []);

  return (
    <div ref={rootRef} className="lbf-page">
      {sections.map((label, index) => (
        <section key={index} className={`lbf-section lbf-section-${index + 1}`}>
          <h1>{label}</h1>
        </section>
      ))}

      <div className="lbf-footer-revealer" />

      <footer>
        <div className="lbf-footer-images">
          <div className="lbf-footer-hand-img">
            <img className="lbf-ascii-hand" src={handLeft} alt="" />
            <canvas />
          </div>

          <div className="lbf-footer-hand-img">
            <img className="lbf-ascii-hand" src={handRight} alt="" />
            <canvas />
          </div>
        </div>

        <div className="lbf-footer-content">
          <nav className="lbf-footer-links">
            {navLinks.map((link) => (
              <a key={link} href="#">
                {link}
              </a>
            ))}
          </nav>

          <div className="lbf-footer-text">
            <p>{footerText}</p>
          </div>
        </div>

        <div className="lbf-footer-header">
          {headerWords.map((word) => (
            <h1 key={word}>{word}</h1>
          ))}
        </div>
      </footer>
    </div>
  );
}
