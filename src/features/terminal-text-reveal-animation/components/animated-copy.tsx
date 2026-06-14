"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface AnimatedCopyProps {
  children: React.ReactNode;
  colorInitial?: string;
  colorAccent?: string;
  colorFinal?: string;
}

interface SplitRef {
  wordSplit: SplitText;
  charSplit: SplitText;
}

export default function AnimatedCopy({
  children,
  colorInitial = "#dddddd",
  colorAccent = "#abff02",
  colorFinal = "#000000",
}: AnimatedCopyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const splitRefs = useRef<SplitRef[]>([]);
  const lastScrollProgress = useRef(0);
  const colorTransitionTimers = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const completedChars = useRef(new Set<number>());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    splitRefs.current = [];
    lastScrollProgress.current = 0;
    colorTransitionTimers.current.clear();
    completedChars.current.clear();

    const elements = Array.from(container.children);
    const triggerElement = elements[0] ?? container;

    elements.forEach((element) => {
      const wordSplit = SplitText.create(element, {
        type: "words",
        wordsClass: "word",
      });

      const charSplit = SplitText.create(wordSplit.words, {
        type: "chars",
        charsClass: "char",
      });

      splitRefs.current.push({ wordSplit, charSplit });
    });

    const allChars = splitRefs.current.flatMap(({ charSplit }) => charSplit.chars);

    gsap.set(allChars, { color: colorInitial });

    const scheduleFinalTransition = (char: Element, index: number) => {
      if (colorTransitionTimers.current.has(index)) {
        clearTimeout(colorTransitionTimers.current.get(index));
      }

      const timer = setTimeout(() => {
        if (!completedChars.current.has(index)) {
          gsap.to(char, {
            duration: 0.1,
            ease: "none",
            color: colorFinal,
            onComplete: () => {
              completedChars.current.add(index);
            },
          });
        }
        colorTransitionTimers.current.delete(index);
      }, 100);

      colorTransitionTimers.current.set(index, timer);
    };

    const trigger = ScrollTrigger.create({
      trigger: triggerElement,
      start: "top 90%",
      end: "top 10%",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const totalChars = allChars.length;
        const isScrollingDown = progress >= lastScrollProgress.current;
        const currentCharIndex = Math.floor(progress * totalChars);

        allChars.forEach((char, index) => {
          if (!isScrollingDown && index >= currentCharIndex) {
            if (colorTransitionTimers.current.has(index)) {
              clearTimeout(colorTransitionTimers.current.get(index));
              colorTransitionTimers.current.delete(index);
            }
            completedChars.current.delete(index);
            gsap.set(char, { color: colorInitial });
            return;
          }

          if (completedChars.current.has(index)) {
            return;
          }

          if (index <= currentCharIndex) {
            gsap.set(char, { color: colorAccent });
            if (!colorTransitionTimers.current.has(index)) {
              scheduleFinalTransition(char, index);
            }
          } else {
            gsap.set(char, { color: colorInitial });
          }
        });

        lastScrollProgress.current = progress;
      },
    });

    return () => {
      trigger.kill();
      colorTransitionTimers.current.forEach((timer) => clearTimeout(timer));
      colorTransitionTimers.current.clear();
      completedChars.current.clear();

      splitRefs.current.forEach(({ wordSplit, charSplit }) => {
        charSplit?.revert();
        wordSplit?.revert();
      });
    };
  }, [colorAccent, colorFinal, colorInitial]);

  return (
    <div ref={containerRef} data-copy-wrapper="true">
      {children}
    </div>
  );
}
