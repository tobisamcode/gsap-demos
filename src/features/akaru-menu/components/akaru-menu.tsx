"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import {
  headerText,
  logoText,
  menuLinks,
  menuMedia,
  navToggleLabel,
  socialColumns,
} from "@/features/akaru-menu/data/content";

gsap.registerPlugin(CustomEase);

const splitTextIntoSpans = (text: string) =>
  text
    .split("")
    .map((char, index) =>
      char === " " ? (
        <span key={index}>&nbsp;&nbsp;</span>
      ) : (
        <span key={index}>{char}</span>
      ),
    );

export default function AkaruMenu() {
  const menuRef = useRef<HTMLDivElement>(null);
  const didMountRef = useRef(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    CustomEase.create(
      "hop",
      "M0,0 C0.354,0 0.464,0.133 0.498,0.502 0.532,0.872 0.651,1 1,1",
    );

    const menu = menuRef.current;
    if (!menu) return;

    const links = menu.querySelectorAll(".link");
    const socialLinks = menu.querySelectorAll(".socials p");
    const headerSpans = menu.querySelectorAll(".header h1 span");

    gsap.set(menu, {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    });
    gsap.set(links, { y: 30, opacity: 0 });
    gsap.set(socialLinks, { y: 30, opacity: 0 });
    gsap.set(headerSpans, { y: 500, rotateY: 90, scale: 0.8 });
  }, []);

  const animateMenu = useCallback((open: boolean) => {
    const menu = menuRef.current;
    if (!menu) return;

    const links = menu.querySelectorAll(".link");
    const socialLinks = menu.querySelectorAll(".socials p");
    const headerSpans = menu.querySelectorAll(".header h1 span");
    const videoWrapper = menu.querySelector(".video-wrapper");

    setIsAnimating(true);

    if (open) {
      gsap.to(menu, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        ease: "hop",
        duration: 1.5,
        onStart: () => {
          menu.style.pointerEvents = "all";
        },
        onComplete: () => setIsAnimating(false),
      });

      gsap.to(links, {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        delay: 0.85,
        duration: 1,
        ease: "power3.out",
      });

      gsap.to(socialLinks, {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        delay: 0.85,
        duration: 1,
        ease: "power3.out",
      });

      gsap.to(videoWrapper, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        ease: "hop",
        duration: 1.5,
        delay: 0.5,
      });

      gsap.to(headerSpans, {
        rotateY: 0,
        stagger: 0.05,
        delay: 0.75,
        duration: 1.5,
        ease: "power4.out",
      });

      gsap.to(headerSpans, {
        y: 0,
        scale: 1,
        stagger: 0.05,
        delay: 0.5,
        duration: 1.5,
        ease: "power4.out",
      });
    } else {
      gsap.to(menu, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        ease: "hop",
        duration: 1.5,
        onComplete: () => {
          menu.style.pointerEvents = "none";
          gsap.set(menu, {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          });
          gsap.set(links, { y: 30, opacity: 0 });
          gsap.set(socialLinks, { y: 30, opacity: 0 });
          gsap.set(headerSpans, { y: 500, rotateY: 90, scale: 0.8 });
          gsap.set(videoWrapper, {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          });
          setIsAnimating(false);
        },
      });
    }
  }, []);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    animateMenu(isOpen);
  }, [isOpen, animateMenu]);

  const toggleMenu = useCallback(() => {
    if (!isAnimating) {
      setIsOpen((prev) => !prev);
    }
  }, [isAnimating]);

  return (
    <div className="akaru-page">
      <div className="logo">
        <a href="#">{logoText}</a>
      </div>

      <div
        className={`menu-toggle ${isOpen ? "opened" : "closed"}`}
        onClick={toggleMenu}
      >
        <div className="menu-toggle-icon">
          <div className="hamburger">
            <div className="menu-bar" data-position="top"></div>
            <div className="menu-bar" data-position="bottom"></div>
          </div>
        </div>
        <div className="menu-copy">
          <p>{navToggleLabel}</p>
        </div>
      </div>

      <div className="menu" ref={menuRef}>
        <div className="col col-1">
          <div className="menu-logo">
            <a href="#">{logoText}</a>
          </div>
          <div className="links">
            {menuLinks.map((label) => (
              <div className="link" key={label}>
                <Link href="/">{label}</Link>
              </div>
            ))}
          </div>
          <div className="video-wrapper">
            <img src={menuMedia} alt="" />
          </div>
        </div>

        <div className="col col-2">
          <div className="socials">
            {socialColumns.map((col, colIndex) => (
              <div className="sub-col" key={colIndex}>
                {col.map((line, lineIndex) =>
                  line === "" ? (
                    <br key={lineIndex} />
                  ) : (
                    <p key={lineIndex}>{line}</p>
                  ),
                )}
              </div>
            ))}
          </div>

          <div className="header">
            <h1>{splitTextIntoSpans(headerText)}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
