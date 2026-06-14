"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import {
  logoImage,
  navLegal,
  navPrimaryLinks,
  navSecondaryLinks,
  navSocials,
} from "@/features/overlay-menu-gsap/data/content";

gsap.registerPlugin(SplitText);

export default function OverlayMenuGsap() {
  const togglerRef = useRef<HTMLButtonElement>(null);
  const navContentRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<HTMLDivElement>(null);
  const navBgsRef = useRef<HTMLDivElement[]>([]);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const linkBlocksRef = useRef<Element[][]>([]);
  const isMenuOpenRef = useRef(false);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const navContent = navContentRef.current;
    const navItems = navItemsRef.current;
    const navBgs = navBgsRef.current.filter(Boolean);
    if (!navContent || !navItems) return;

    const splits: SplitText[] = [];
    let timeline: gsap.core.Timeline | null = null;

    const setup = () => {
      timeline = gsap.timeline({
        paused: true,
        onComplete: () => {
          isAnimatingRef.current = false;
        },
        onReverseComplete: () => {
          linkBlocksRef.current.forEach((lines) => {
            gsap.set(lines, { y: "100%" });
          });
          isAnimatingRef.current = false;
        },
      });

      timeline.to(navBgs, {
        scaleY: 1,
        duration: 0.75,
        stagger: 0.1,
        ease: "power3.inOut",
      });

      timeline.to(
        navItems,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 0.75,
          ease: "power3.inOut",
        },
        "-=0.6"
      );

      navItems.querySelectorAll<HTMLAnchorElement>("a").forEach((anchor) => {
        splits.push(
          SplitText.create(anchor, {
            type: "lines",
            mask: "lines",
            linesClass: "omg-line",
          })
        );
      });

      const collectLines = (selector: string) =>
        Array.from(navItems.querySelectorAll(`${selector} .omg-line`));

      linkBlocksRef.current = [
        [
          ...collectLines(".omg-nav-socials"),
          ...collectLines(".omg-nav-legal"),
        ],
        collectLines(".omg-nav-primary-links"),
        collectLines(".omg-nav-secondary-links"),
      ];

      linkBlocksRef.current.forEach((lines) => {
        gsap.set(lines, { y: "100%" });
      });

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
      linkBlocksRef.current = [];
    };
  }, []);

  const animateLinksIn = () => {
    linkBlocksRef.current.forEach((lines) => {
      gsap.fromTo(
        lines,
        { y: "100%" },
        {
          y: "0%",
          duration: 0.75,
          stagger: 0.05,
          ease: "power3.out",
          delay: 0.85,
        }
      );
    });
  };

  const handleToggle = () => {
    const timeline = timelineRef.current;
    const toggler = togglerRef.current;
    if (!timeline || !toggler) return;
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    toggler.classList.toggle("open");

    if (!isMenuOpenRef.current) {
      timeline.play();
      animateLinksIn();
    } else {
      timeline.reverse();
    }

    isMenuOpenRef.current = !isMenuOpenRef.current;
  };

  const registerBg = (index: number) => (el: HTMLDivElement | null) => {
    if (el) navBgsRef.current[index] = el;
  };

  return (
    <div className="omg-page">
      <nav className="omg-nav">
        <div className="omg-nav-logo">
          <a href="#">
            <img src={logoImage} alt="" />
          </a>
        </div>
        <button
          type="button"
          className="omg-nav-toggler"
          ref={togglerRef}
          onClick={handleToggle}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
        </button>
      </nav>

      <div ref={navContentRef} className="omg-nav-content">
        <div ref={registerBg(0)} className="omg-nav-bg"></div>
        <div ref={registerBg(1)} className="omg-nav-bg"></div>
        <div ref={registerBg(2)} className="omg-nav-bg"></div>
        <div ref={registerBg(3)} className="omg-nav-bg"></div>

        <div ref={navItemsRef} className="omg-nav-items">
          <div className="omg-nav-items-col">
            <div className="omg-nav-socials">
              {navSocials.map((link) => (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
            <div className="omg-nav-legal">
              {navLegal.map((link) => (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div className="omg-nav-items-col">
            <div className="omg-nav-primary-links">
              {navPrimaryLinks.map((link) => (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
            <div className="omg-nav-secondary-links">
              {navSecondaryLinks.map((link) => (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="omg-hero"></section>
    </div>
  );
}
