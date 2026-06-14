"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import SmoothScroll from "@/features/nakedcityfilms-scroll-animation/components/smooth-scroll";
import "@/features/nakedcityfilms-scroll-animation/styles/nakedcityfilms-scroll-animation.scss";

gsap.registerPlugin(ScrollTrigger, Flip);

export default function NakedcityfilmsScrollAnimationPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const triggerEl = triggerRef.current!;
    let navTrigger: ScrollTrigger | null = null;

    const initNavbarAnimations = () => {
      const navbarBg = root.querySelector<HTMLElement>(".navbar-background")!;
      const navbarItems = root.querySelector<HTMLElement>(".navbar-items")!;
      const navbarLinks = root.querySelectorAll<HTMLElement>(".navbar-links");
      const navbarLogo = root.querySelector<HTMLElement>(".navbar-logo")!;

      const isDesktop = window.innerWidth >= 720;
      if (!isDesktop) {
        navbarLogo.classList.add("navbar-logo-pinned");
        gsap.set(navbarLogo, { width: 250 });
        gsap.set([navbarBg, navbarItems], { width: "100%", height: "100vh" });
        return;
      }

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const initialWidth = navbarBg.offsetWidth;
      const initialHeight = navbarBg.offsetHeight;
      const initialLinksWidths = Array.from(navbarLinks).map(
        (link) => link.offsetWidth,
      );

      const state = Flip.getState(navbarLogo);
      navbarLogo.classList.add("navbar-logo-pinned");
      gsap.set(navbarLogo, { width: 250 });
      const flip = Flip.from(state, {
        duration: 1,
        ease: "none",
        paused: true,
      });

      navTrigger = ScrollTrigger.create({
        trigger: triggerEl,
        start: "top top",
        end: `+=${viewportHeight}px`,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;

          gsap.set([navbarBg, navbarItems], {
            width: gsap.utils.interpolate(initialWidth, viewportWidth, p),
            height: gsap.utils.interpolate(initialHeight, viewportHeight, p),
          });

          navbarLinks.forEach((link, i) => {
            gsap.set(link, {
              width: gsap.utils.interpolate(
                link.offsetWidth,
                initialLinksWidths[i],
                p,
              ),
            });
          });

          flip.progress(p);
        },
      });
    };

    initNavbarAnimations();

    let timer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        navTrigger?.kill();
        navTrigger = null;

        const navbarBg = root.querySelector<HTMLElement>(".navbar-background")!;
        const navbarItems = root.querySelector<HTMLElement>(".navbar-items")!;
        const navbarLinks = root.querySelectorAll<HTMLElement>(".navbar-links");
        const navbarLogo = root.querySelector<HTMLElement>(".navbar-logo")!;

        gsap.set([navbarBg, navbarItems, navbarLogo, ...navbarLinks], {
          clearProps: "all",
        });
        navbarLogo.classList.remove("navbar-logo-pinned");

        initNavbarAnimations();
        ScrollTrigger.refresh();
      }, 250);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
      navTrigger?.kill();
    };
  }, []);

  return (
    <div ref={rootRef} className="naked-page">
      <div className="navbar-backdrop">
        <div className="navbar-img">
          <img src="/images/nakedcityfilms-scroll-animation/navbar-img.jpg" alt="" />
        </div>
        <div className="navbar-background" />
      </div>

      <SmoothScroll>
        <div ref={triggerRef} className="scroll-spacer" aria-hidden />

        <section className="hero">
          <h1>Designing movement beyond fixed frames and rigid form</h1>
        </section>

        <section className="about">
          <h1>The frame dissolves, but the movement continues forward</h1>
        </section>
      </SmoothScroll>

      <div className="navbar-items">
        <div className="navbar-links">
          <a href="#">Index</a>
          <a href="#">Studio</a>
        </div>
        <div className="navbar-links">
          <a href="#">Archive</a>
          <a href="#">Connect</a>
        </div>

        <div className="navbar-logo">
          <a href="#">
            <img src="/images/nakedcityfilms-scroll-animation/logo.svg" alt="" />
          </a>
        </div>
      </div>
    </div>
  );
}
