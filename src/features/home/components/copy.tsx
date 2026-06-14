"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface CopyProps {
  children: React.ReactNode;
  animateOnScroll?: boolean;
  delay?: number;
}

export default function Copy({
  children,
  animateOnScroll = true,
  delay = 0,
}: CopyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let ctx: gsap.Context | undefined;

    const build = () => {
      if (cancelled || !container) return;

      ctx = gsap.context(() => {
        const elements = Array.from(container.children);
        const lines: Element[] = [];

        elements.forEach((element) => {
          const split = SplitText.create(element, {
            type: "lines",
            mask: "lines",
            linesClass: "line++",
            lineThreshold: 0.1,
          });

          const computedStyle = window.getComputedStyle(element);
          const textIndent = computedStyle.textIndent;

          if (textIndent && textIndent !== "0px" && split.lines.length > 0) {
            (split.lines[0] as HTMLElement).style.paddingLeft = textIndent;
            (element as HTMLElement).style.textIndent = "0";
          }

          lines.push(...split.lines);
        });

        gsap.set(lines, { y: "100%" });

        const animationProps = {
          y: "0%",
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          delay,
        };

        if (animateOnScroll) {
          gsap.to(lines, {
            ...animationProps,
            scrollTrigger: {
              trigger: elements[0] ?? container,
              start: "top 75%",
              once: true,
            },
          });
        } else {
          gsap.to(lines, animationProps);
        }
      }, container);
    };

    // Wait for web fonts before splitting so line measurements are correct,
    // otherwise the masked-line reveal can be computed against the wrong
    // metrics and get stuck off-screen.
    if (document.fonts?.status === "loaded") {
      build();
    } else {
      document.fonts.ready.then(build);
    }

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [animateOnScroll, delay]);

  return (
    <div ref={containerRef} data-copy-wrapper="true">
      {children}
    </div>
  );
}
