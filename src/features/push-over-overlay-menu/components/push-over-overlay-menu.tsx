"use client";

import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";
import {
  heroHeading,
  heroImage,
  logoImage,
  menuFooter,
  menuLinks,
  menuMediaImage,
  menuTags,
  outroHeading,
} from "@/features/push-over-overlay-menu/data/content";

gsap.registerPlugin(CustomEase, SplitText);

export default function PushOverOverlayMenu() {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const overlayContentRef = useRef<HTMLDivElement>(null);
  const mediaWrapperRef = useRef<HTMLDivElement>(null);
  const toggleLabelRef = useRef<HTMLParagraphElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);
  const colsRef = useRef<HTMLDivElement[]>([]);

  const splitsRef = useRef<SplitText[][]>([]);
  const isMenuOpenRef = useRef(false);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    CustomEase.create("hop", ".87,0,.13,1");

    const splitsByContainer: SplitText[][] = [];

    const buildSplits = () => {
      colsRef.current.forEach((col) => {
        if (!col) return;
        const textElements = col.querySelectorAll<HTMLElement>("a, p");
        const containerSplits: SplitText[] = [];

        textElements.forEach((element) => {
          const split = SplitText.create(element, {
            type: "lines",
            mask: "lines",
            linesClass: "pom-line",
          });
          containerSplits.push(split);
          gsap.set(split.lines, { y: "-110%" });
        });

        splitsByContainer.push(containerSplits);
      });

      splitsRef.current = splitsByContainer;
    };

    if (document.fonts?.status === "loaded") {
      buildSplits();
    } else {
      document.fonts.ready.then(buildSplits);
    }

    return () => {
      splitsByContainer.forEach((containerSplits) =>
        containerSplits.forEach((split) => split.revert())
      );
      splitsRef.current = [];
    };
  }, []);

  const toggleMenu = useCallback(() => {
    if (isAnimatingRef.current) return;

    const container = containerRef.current;
    const overlay = overlayRef.current;
    const overlayContent = overlayContentRef.current;
    const mediaWrapper = mediaWrapperRef.current;
    const toggleLabel = toggleLabelRef.current;
    const hamburger = hamburgerRef.current;
    const cols = colsRef.current.filter(Boolean);

    if (
      !container ||
      !overlay ||
      !overlayContent ||
      !mediaWrapper ||
      !toggleLabel ||
      !hamburger
    ) {
      return;
    }

    if (!isMenuOpenRef.current) {
      isAnimatingRef.current = true;
      document.body.style.overflow = "hidden";

      const tl = gsap.timeline();

      tl.to(toggleLabel, { y: "-110%", duration: 1, ease: "hop" }, "<")
        .to(container, { y: "100svh", duration: 1, ease: "hop" }, "<")
        .to(
          overlay,
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1,
            ease: "hop",
          },
          "<"
        )
        .to(overlayContent, { yPercent: 0, duration: 1, ease: "hop" }, "<")
        .to(
          mediaWrapper,
          { opacity: 1, duration: 0.75, ease: "power2.out", delay: 0.5 },
          "<"
        );

      splitsRef.current.forEach((containerSplits) => {
        const copyLines = containerSplits.flatMap((split) => split.lines);
        tl.to(
          copyLines,
          { y: "0%", duration: 2, ease: "hop", stagger: -0.075 },
          -0.15
        );
      });

      hamburger.classList.add("active");
      tl.call(() => {
        isAnimatingRef.current = false;
      });

      isMenuOpenRef.current = true;
    } else {
      isAnimatingRef.current = true;
      hamburger.classList.remove("active");

      const tl = gsap.timeline();

      tl.to(container, { y: "0svh", duration: 1, ease: "hop" })
        .to(
          overlay,
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            duration: 1,
            ease: "hop",
          },
          "<"
        )
        .to(overlayContent, { yPercent: -50, duration: 1, ease: "hop" }, "<")
        .to(toggleLabel, { y: "0%", duration: 1, ease: "hop" }, "<")
        .to(cols, { opacity: 0.25, duration: 1, ease: "hop" }, "<");

      tl.call(() => {
        splitsRef.current.forEach((containerSplits) => {
          const copyLines = containerSplits.flatMap((split) => split.lines);
          gsap.set(copyLines, { y: "-110%" });
        });

        gsap.set(cols, { opacity: 1 });
        gsap.set(mediaWrapper, { opacity: 0 });

        isAnimatingRef.current = false;
        document.body.style.overflow = "";
      });

      isMenuOpenRef.current = false;
    }
  }, []);

  const registerCol = (index: number) => (el: HTMLDivElement | null) => {
    if (el) colsRef.current[index] = el;
  };

  return (
    <div className="pom-page">
      <nav className="pom-nav">
        <div className="pom-menu-bar">
          <div className="pom-menu-logo">
            <a href="#">
              <img src={logoImage} alt="" />
            </a>
          </div>
          <div className="pom-menu-toggle-btn" onClick={toggleMenu}>
            <div className="pom-menu-toggle-label">
              <p ref={toggleLabelRef}>Menu</p>
            </div>
            <div ref={hamburgerRef} className="pom-menu-hamburger-icon">
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <div ref={overlayRef} className="pom-menu-overlay">
          <div ref={overlayContentRef} className="pom-menu-overlay-content">
            <div ref={mediaWrapperRef} className="pom-menu-media-wrapper">
              <img src={menuMediaImage} alt="" />
            </div>
            <div className="pom-menu-content-wrapper">
              <div className="pom-menu-content-main">
                <div ref={registerCol(0)} className="pom-menu-col">
                  {menuLinks.map((link) => (
                    <div key={link.label} className="pom-menu-link">
                      <a href={link.href}>{link.label}</a>
                    </div>
                  ))}
                </div>

                <div ref={registerCol(1)} className="pom-menu-col">
                  {menuTags.map((tag) => (
                    <div key={tag.label} className="pom-menu-tag">
                      <a href={tag.href}>{tag.label}</a>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pom-menu-footer">
                <div ref={registerCol(2)} className="pom-menu-col">
                  <p>{menuFooter.location}</p>
                </div>
                <div ref={registerCol(3)} className="pom-menu-col">
                  <p>{menuFooter.phone}</p>
                  <p>{menuFooter.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div ref={containerRef} className="pom-container">
        <section className="pom-hero">
          <h1>{heroHeading}</h1>
        </section>
        <section className="pom-banner">
          <img src={heroImage} alt="" />
        </section>
        <section className="pom-outro">
          <h1>{outroHeading}</h1>
        </section>
      </div>
    </div>
  );
}
