"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  footerPrimary,
  footerSecondary,
  heroHeading,
  heroImage,
  logoLabel,
  menuLinks,
  menuSocials,
  previewDefaultImage,
} from "@/features/exoape-menu/data/content";

export default function ExoapeMenu() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const container = root.querySelector<HTMLDivElement>(".exo-container");
    const menuToggle = root.querySelector<HTMLDivElement>(".exo-menu-toggle");
    const menuOverlay = root.querySelector<HTMLDivElement>(".exo-menu-overlay");
    const menuContent = root.querySelector<HTMLDivElement>(".exo-menu-content");
    const menuPreviewImg = root.querySelector<HTMLDivElement>(
      ".exo-menu-preview-img"
    );
    const openText = root.querySelector<HTMLParagraphElement>("p#exo-menu-open");
    const closeText = root.querySelector<HTMLParagraphElement>(
      "p#exo-menu-close"
    );
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>(".exo-link a"));
    const animatedAnchors = Array.from(
      root.querySelectorAll<HTMLAnchorElement>(".exo-link a, .exo-social a")
    );
    if (
      !container ||
      !menuToggle ||
      !menuOverlay ||
      !menuContent ||
      !menuPreviewImg ||
      !openText ||
      !closeText
    ) {
      return;
    }

    let isOpen = false;
    let isAnimating = false;

    const cleanupPreviewImages = () => {
      const previewImages = menuPreviewImg.querySelectorAll("img");
      if (previewImages.length > 3) {
        for (let i = 0; i < previewImages.length - 3; i++) {
          menuPreviewImg.removeChild(previewImages[i]);
        }
      }
    };

    const resetPreviewImage = () => {
      menuPreviewImg.innerHTML = "";
      const defaultPreviewImg = document.createElement("img");
      defaultPreviewImg.src = previewDefaultImage;
      menuPreviewImg.appendChild(defaultPreviewImg);
    };

    const animateMenuToggle = (isOpening: boolean) => {
      gsap.to(isOpening ? openText : closeText, {
        x: -5,
        y: isOpening ? -10 : 10,
        rotation: isOpening ? -5 : 5,
        opacity: 0,
        delay: 0.25,
        duration: 0.5,
        ease: "power2.out",
      });

      gsap.to(isOpening ? closeText : openText, {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        delay: 0.5,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const openMenu = () => {
      if (isAnimating || isOpen) return;
      isAnimating = true;

      gsap.to(container, {
        rotation: 10,
        x: 300,
        y: 450,
        scale: 1.5,
        duration: 1.25,
        ease: "power4.inOut",
      });

      animateMenuToggle(true);

      gsap.to(menuContent, {
        rotation: 0,
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1.25,
        ease: "power4.inOut",
      });

      gsap.to(animatedAnchors, {
        y: "0%",
        delay: 0.75,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      });

      gsap.to(menuOverlay, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 175%, 0% 100%)",
        duration: 1.25,
        ease: "power4.inOut",
        onComplete: () => {
          isOpen = true;
          isAnimating = false;
        },
      });
    };

    const closeMenu = () => {
      if (isAnimating || !isOpen) return;
      isAnimating = true;

      gsap.to(container, {
        rotation: 0,
        x: 0,
        y: 0,
        scale: 1,
        duration: 1.25,
        ease: "power4.inOut",
      });

      animateMenuToggle(false);

      gsap.to(menuContent, {
        rotation: -15,
        x: -100,
        y: -100,
        scale: 1.5,
        opacity: 0.25,
        duration: 1.25,
        ease: "power4.inOut",
      });

      gsap.to(menuOverlay, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1.25,
        ease: "power4.inOut",
        onComplete: () => {
          isOpen = false;
          isAnimating = false;
          gsap.set(animatedAnchors, { y: "120%" });
          resetPreviewImage();
        },
      });
    };

    const handleToggle = () => {
      if (!isOpen) openMenu();
      else closeMenu();
    };

    const handleLinkOver = (link: HTMLAnchorElement) => () => {
      if (!isOpen || isAnimating) return;

      const imgSrc = link.getAttribute("data-img");
      if (!imgSrc) return;

      const previewImages = menuPreviewImg.querySelectorAll("img");
      if (
        previewImages.length > 0 &&
        previewImages[previewImages.length - 1].src.endsWith(imgSrc)
      ) {
        return;
      }

      const newPreviewImg = document.createElement("img");
      newPreviewImg.src = imgSrc;
      newPreviewImg.style.opacity = "0";
      newPreviewImg.style.transform = "scale(1.25) rotate(10deg)";

      menuPreviewImg.appendChild(newPreviewImg);
      cleanupPreviewImages();

      gsap.to(newPreviewImg, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.75,
        ease: "power2.out",
      });
    };

    menuToggle.addEventListener("click", handleToggle);
    const overHandlers = links.map((link) => handleLinkOver(link));
    links.forEach((link, index) => {
      link.addEventListener("mouseover", overHandlers[index]);
    });

    return () => {
      menuToggle.removeEventListener("click", handleToggle);
      links.forEach((link, index) => {
        link.removeEventListener("mouseover", overHandlers[index]);
      });
    };
  }, []);

  return (
    <div ref={rootRef} className="exo-page">
      <nav className="exo-nav">
        <div className="exo-logo">
          <a href="#">{logoLabel}</a>
        </div>
        <div className="exo-menu-toggle">
          <p id="exo-menu-open">Menu</p>
          <p id="exo-menu-close">Close</p>
        </div>
      </nav>

      <div className="exo-menu-overlay">
        <div className="exo-menu-content">
          <div className="exo-menu-items">
            <div className="exo-col-lg">
              <div className="exo-menu-preview-img">
                <img src={previewDefaultImage} alt="" />
              </div>
            </div>
            <div className="exo-col-sm">
              <div className="exo-menu-links">
                {menuLinks.map((link) => (
                  <div key={link.label} className="exo-link">
                    <a href={link.href} data-img={link.image}>
                      {link.label}
                    </a>
                  </div>
                ))}
              </div>

              <div className="exo-menu-socials">
                {menuSocials.map((social) => (
                  <div key={social.label} className="exo-social">
                    <a href={social.href}>{social.label}</a>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="exo-menu-footer">
            <div className="exo-col-lg">
              <a href={footerPrimary.href}>{footerPrimary.label}</a>
            </div>
            <div className="exo-col-sm">
              {footerSecondary.map((link) => (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="exo-container">
        <section className="exo-hero">
          <div className="exo-hero-img">
            <img src={heroImage} alt="" />
          </div>
          <h1>{heroHeading}</h1>
        </section>
      </div>
    </div>
  );
}
