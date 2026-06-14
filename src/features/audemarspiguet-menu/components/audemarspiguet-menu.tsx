"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import {
  heroHeading,
  menuCopyright,
  menuLegalLinks,
  menuPrimaryLinks,
  menuSecondaryLinks,
  navCta,
  navLogo,
} from "@/features/audemarspiguet-menu/data/content";

gsap.registerPlugin(SplitText, CustomEase);

export default function AudemarspiguetMenu() {
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isMenuOpenRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const menu = menuRef.current;
    if (!container || !menu) return;

    CustomEase.create("hop", "0.85, 0, 0.15, 1");

    const splits: SplitText[] = [];
    let timeline: gsap.core.Timeline | null = null;

    const setup = () => {
      menu.querySelectorAll<HTMLElement>("a, p").forEach((el) => {
        splits.push(
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            linesClass: "line",
          })
        );
      });

      timeline = gsap.timeline({ paused: true });

      timeline
        .to(
          container.querySelector(".ap-nav-toggle-btn .bar-1"),
          { y: 3.25, rotation: 45, scaleX: 0.75, duration: 1, ease: "hop" },
          0
        )
        .to(
          container.querySelector(".ap-nav-toggle-btn .bar-2"),
          { y: -3.25, rotation: -45, scaleX: 0.75, duration: 1, ease: "hop" },
          0
        )
        .to(
          menu.querySelector(".ap-menu-bg-left-inner"),
          { rotate: 0, duration: 1, ease: "hop" },
          0
        )
        .to(
          menu.querySelector(".ap-menu-bg-right-inner"),
          { rotate: 0, duration: 1, ease: "hop" },
          0
        )
        .to(
          menu.querySelectorAll(".ap-menu-items-col:nth-child(1) .line"),
          { y: 0, duration: 0.75, ease: "power3.out", stagger: 0.1 },
          "0.6"
        )
        .to(
          menu.querySelectorAll(".ap-menu-items-col:nth-child(2) .line"),
          { y: 0, duration: 0.75, ease: "power3.out", stagger: 0.1 },
          "<"
        )
        .to(
          menu.querySelectorAll(".ap-menu-footer .line"),
          { y: 0, duration: 0.75, ease: "power3.out", stagger: 0.1 },
          "<"
        );

      timelineRef.current = timeline;
    };

    if (document.fonts?.status === "loaded") {
      setup();
    } else {
      document.fonts.ready.then(setup);
    }

    return () => {
      timeline?.kill();
      splits.forEach((split) => split.revert());
      timelineRef.current = null;
    };
  }, []);

  const handleToggle = () => {
    const timeline = timelineRef.current;
    const menu = menuRef.current;
    if (!timeline || !menu) return;

    if (isMenuOpenRef.current) {
      timeline.reverse();
      menu.classList.remove("active");
    } else {
      timeline.play();
      menu.classList.add("active");
    }

    isMenuOpenRef.current = !isMenuOpenRef.current;
  };

  return (
    <div ref={containerRef} className="ap-page">
      <nav className="ap-nav">
        <div className="ap-nav-toggle">
          <button
            type="button"
            className="ap-nav-toggle-btn"
            ref={toggleRef}
            onClick={handleToggle}
            aria-label="Toggle menu"
          >
            <span className="bar-1"></span>
            <span className="bar-2"></span>
          </button>
        </div>
        <div className="ap-nav-logo">
          <a href="#">{navLogo}</a>
        </div>
        <div className="ap-nav-cta">
          <a href={navCta.href}>{navCta.label}</a>
        </div>
      </nav>

      <div ref={menuRef} className="ap-menu">
        <div className="ap-menu-bg">
          <div className="ap-menu-bg-left">
            <div className="ap-menu-bg-left-inner"></div>
          </div>
          <div className="ap-menu-bg-right">
            <div className="ap-menu-bg-right-inner"></div>
          </div>
        </div>
        <div className="ap-menu-items">
          <div className="ap-menu-items-col">
            {menuPrimaryLinks.map((link) => (
              <div key={link.label} className="ap-menu-link">
                <a href={link.href}>{link.label}</a>
              </div>
            ))}
          </div>
          <div className="ap-menu-items-col">
            {menuSecondaryLinks.map((link) => (
              <div key={link.label} className="ap-menu-link">
                <a href={link.href}>{link.label}</a>
              </div>
            ))}
          </div>
          <div className="ap-menu-footer">
            <div className="ap-menu-footer-col">
              {menuLegalLinks.map((link) => (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
            <div className="ap-menu-footer-col">
              <p>{menuCopyright}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="ap-hero">
        <h1>{heroHeading}</h1>
      </section>
    </div>
  );
}
