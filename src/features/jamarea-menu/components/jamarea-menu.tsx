"use client";

import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import {
  heroHeading,
  menuImage,
  menuInfoColumns,
  menuLinks,
  navItemLabel,
  navToggleLabel,
} from "@/features/jamarea-menu/data/content";

gsap.registerPlugin(SplitText);

export default function JamareaMenu() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const q = <T extends Element>(selector: string) =>
      root.querySelector<T>(selector);
    const qa = <T extends Element>(selector: string) =>
      Array.from(root.querySelectorAll<T>(selector));

    const container = q<HTMLDivElement>(".jam-container");
    const navToggle = q<HTMLDivElement>(".jam-nav-toggle");
    const menuOverlay = q<HTMLDivElement>(".jam-menu-overlay");
    const menuContent = q<HTMLDivElement>(".jam-menu-content");
    const menuImageEl = q<HTMLDivElement>(".jam-menu-img");
    const menuLinksWrapper = q<HTMLDivElement>(".jam-menu-links-wrapper");
    const linkHighlighter = q<HTMLDivElement>(".jam-link-highlighter");
    if (
      !container ||
      !navToggle ||
      !menuOverlay ||
      !menuContent ||
      !menuImageEl ||
      !menuLinksWrapper ||
      !linkHighlighter
    ) {
      return;
    }

    let currentX = 0;
    let targetX = 0;
    const lerpFactor = 0.05;

    let currentHighlighterX = 0;
    let targetHighlighterX = 0;
    let currentHighlighterWidth = 0;
    let targetHighlighterWidth = 0;

    let isMenuOpen = false;
    let isMenuAnimating = false;

    const links = qa<HTMLAnchorElement>(".jam-menu-link a");
    const linkContainers = qa<HTMLDivElement>(".jam-menu-link");
    const splits: SplitText[] = [];

    links.forEach((link) => {
      const spans = link.querySelectorAll<HTMLSpanElement>("span");
      spans.forEach((span, spanIndex) => {
        const split = new SplitText(span, { type: "chars" });
        splits.push(split);
        split.chars.forEach((char) => char.classList.add("jam-char"));
        if (spanIndex === 1) {
          gsap.set(split.chars, { y: "110%" });
        }
      });
    });

    gsap.set(menuContent, { y: "50%", opacity: 0.25 });
    gsap.set(menuImageEl, { scale: 0.5, opacity: 0.25 });
    gsap.set(links, { y: "150%" });
    gsap.set(linkHighlighter, { y: "150%" });

    const firstLinkContainer = linkContainers[0];
    const firstLinkSpan = firstLinkContainer?.querySelector<HTMLSpanElement>(
      "a span"
    );
    if (firstLinkContainer && firstLinkSpan) {
      const linkWidth = firstLinkSpan.offsetWidth;
      linkHighlighter.style.width = `${linkWidth}px`;
      currentHighlighterWidth = linkWidth;
      targetHighlighterWidth = linkWidth;

      const linkRect = firstLinkContainer.getBoundingClientRect();
      const menuWrapperRect = menuLinksWrapper.getBoundingClientRect();
      const initialX = linkRect.left - menuWrapperRect.left;
      currentHighlighterX = initialX;
      targetHighlighterX = initialX;
    }

    const toggleMenu = () => {
      if (isMenuAnimating) return;
      isMenuAnimating = true;

      if (!isMenuOpen) {
        gsap.to(container, {
          y: "-40%",
          opacity: 0.25,
          duration: 1.25,
          ease: "expo.out",
        });

        gsap.to(menuOverlay, {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
          duration: 1.25,
          ease: "expo.out",
          onComplete: () => {
            gsap.set(container, { y: "40%" });
            gsap.set(linkContainers, { overflow: "visible" });
            isMenuOpen = true;
            isMenuAnimating = false;
          },
        });

        gsap.to(menuContent, {
          y: "0%",
          opacity: 1,
          duration: 1.5,
          ease: "expo.out",
        });

        gsap.to(menuImageEl, {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: "expo.out",
        });

        gsap.to(links, {
          y: "0%",
          duration: 1.25,
          stagger: 0.1,
          delay: 0.25,
          ease: "expo.out",
        });

        gsap.to(linkHighlighter, {
          y: "0%",
          duration: 1,
          delay: 1,
          ease: "expo.out",
        });
      } else {
        gsap.to(container, {
          y: "0%",
          opacity: 1,
          duration: 1.25,
          ease: "expo.out",
        });

        gsap.to(links, {
          y: "-200%",
          duration: 1.25,
          ease: "expo.out",
        });

        gsap.to(menuContent, {
          y: "-100%",
          opacity: 0.25,
          duration: 1.25,
          ease: "expo.out",
        });

        gsap.to(menuImageEl, {
          y: "-100%",
          opacity: 0.5,
          duration: 1.25,
          ease: "expo.out",
        });

        gsap.to(menuOverlay, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 1.25,
          ease: "expo.out",
          onComplete: () => {
            gsap.set(menuOverlay, {
              clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
            });
            gsap.set(links, { y: "150%" });
            gsap.set(linkHighlighter, { y: "150%" });
            gsap.set(menuContent, { y: "50%", opacity: 0.25 });
            gsap.set(menuImageEl, { y: "0%", scale: 0.5, opacity: 0.25 });
            gsap.set(linkContainers, { overflow: "hidden" });

            gsap.set(menuLinksWrapper, { x: 0 });
            currentX = 0;
            targetX = 0;

            isMenuOpen = false;
            isMenuAnimating = false;
          },
        });
      }
    };

    const handleLinkEnter = (link: HTMLDivElement) => () => {
      if (window.innerWidth < 1000) return;

      const linkCopy = link.querySelectorAll<HTMLSpanElement>("a span");
      const visibleChars = linkCopy[0].querySelectorAll(".jam-char");
      const animatedChars = linkCopy[1].querySelectorAll(".jam-char");

      gsap.to(visibleChars, {
        y: "-110%",
        stagger: 0.03,
        duration: 0.5,
        ease: "expo.inOut",
      });
      gsap.to(animatedChars, {
        y: "0%",
        stagger: 0.03,
        duration: 0.5,
        ease: "expo.inOut",
      });

      const linkRect = link.getBoundingClientRect();
      const menuWrapperRect = menuLinksWrapper.getBoundingClientRect();
      targetHighlighterX = linkRect.left - menuWrapperRect.left;
      const linkCopyElement = link.querySelector<HTMLSpanElement>("a span");
      targetHighlighterWidth = linkCopyElement
        ? linkCopyElement.offsetWidth
        : link.offsetWidth;
    };

    const handleLinkLeave = (link: HTMLDivElement) => () => {
      if (window.innerWidth < 1000) return;

      const linkCopy = link.querySelectorAll<HTMLSpanElement>("a span");
      const visibleChars = linkCopy[0].querySelectorAll(".jam-char");
      const animatedChars = linkCopy[1].querySelectorAll(".jam-char");

      gsap.to(animatedChars, {
        y: "110%",
        stagger: 0.03,
        duration: 0.5,
        ease: "expo.inOut",
      });
      gsap.to(visibleChars, {
        y: "0%",
        stagger: 0.03,
        duration: 0.5,
        ease: "expo.inOut",
      });
    };

    const handleOverlayMove = (e: MouseEvent) => {
      if (window.innerWidth < 1000) return;

      const mouseX = e.clientX;
      const viewportWidth = window.innerWidth;
      const menuLinksWrapperWidth = menuLinksWrapper.offsetWidth;

      const maxMoveLeft = 0;
      const maxMoveRight = viewportWidth - menuLinksWrapperWidth;

      const sensitivityRange = viewportWidth * 0.5;
      const startX = (viewportWidth - sensitivityRange) / 2;
      const endX = startX + sensitivityRange;

      let mousePercentage;
      if (mouseX <= startX) {
        mousePercentage = 0;
      } else if (mouseX >= endX) {
        mousePercentage = 1;
      } else {
        mousePercentage = (mouseX - startX) / sensitivityRange;
      }

      targetX = maxMoveLeft + mousePercentage * (maxMoveRight - maxMoveLeft);
    };

    const handleWrapperLeave = () => {
      if (!firstLinkContainer || !firstLinkSpan) return;
      const linkRect = firstLinkContainer.getBoundingClientRect();
      const menuWrapperRect = menuLinksWrapper.getBoundingClientRect();
      targetHighlighterX = linkRect.left - menuWrapperRect.left;
      targetHighlighterWidth = firstLinkSpan.offsetWidth;
    };

    navToggle.addEventListener("click", toggleMenu);
    menuOverlay.addEventListener("mousemove", handleOverlayMove);
    menuLinksWrapper.addEventListener("mouseleave", handleWrapperLeave);

    const enterHandlers = linkContainers.map((link) => handleLinkEnter(link));
    const leaveHandlers = linkContainers.map((link) => handleLinkLeave(link));
    linkContainers.forEach((link, index) => {
      link.addEventListener("mouseenter", enterHandlers[index]);
      link.addEventListener("mouseleave", leaveHandlers[index]);
    });

    let frameId = 0;
    const animate = () => {
      currentX += (targetX - currentX) * lerpFactor;
      currentHighlighterX +=
        (targetHighlighterX - currentHighlighterX) * lerpFactor;
      currentHighlighterWidth +=
        (targetHighlighterWidth - currentHighlighterWidth) * lerpFactor;

      gsap.to(menuLinksWrapper, {
        x: currentX,
        duration: 0.3,
        ease: "power4.out",
      });

      gsap.to(linkHighlighter, {
        x: currentHighlighterX,
        width: currentHighlighterWidth,
        duration: 0.3,
        ease: "power4.out",
      });

      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      navToggle.removeEventListener("click", toggleMenu);
      menuOverlay.removeEventListener("mousemove", handleOverlayMove);
      menuLinksWrapper.removeEventListener("mouseleave", handleWrapperLeave);
      linkContainers.forEach((link, index) => {
        link.removeEventListener("mouseenter", enterHandlers[index]);
        link.removeEventListener("mouseleave", leaveHandlers[index]);
      });
      splits.forEach((split) => split.revert());
    };
  }, []);

  return (
    <div ref={rootRef} className="jam-page">
      <nav className="jam-nav">
        <div className="jam-nav-toggle">
          <p>{navToggleLabel}</p>
        </div>
        <div className="jam-nav-item">
          <p>{navItemLabel}</p>
        </div>
      </nav>

      <div className="jam-menu-overlay">
        <div className="jam-menu-content">
          {menuInfoColumns.map((col, colIndex) => (
            <div key={colIndex} className="jam-menu-col">
              {col.blocks.map((block, blockIndex) => (
                <Fragment key={blockIndex}>
                  {block.map((line, lineIndex) => (
                    <p key={lineIndex}>{line}</p>
                  ))}
                  {blockIndex < col.blocks.length - 1 &&
                    Array.from({ length: col.spacer }).map((_, i) => (
                      <br key={i} />
                    ))}
                </Fragment>
              ))}
            </div>
          ))}
        </div>

        <div className="jam-menu-img">
          <img src={menuImage} alt="" />
        </div>

        <div className="jam-menu-links-wrapper">
          {menuLinks.map((label) => (
            <div key={label} className="jam-menu-link">
              <a href="#">
                <span>{label}</span>
                <span>{label}</span>
              </a>
            </div>
          ))}

          <div className="jam-link-highlighter"></div>
        </div>
      </div>

      <div className="jam-container">
        <section className="jam-hero">
          <h1>{heroHeading}</h1>
        </section>
      </div>
    </div>
  );
}
