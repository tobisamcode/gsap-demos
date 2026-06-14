"use client";

import { useEffect, useRef } from "react";
import {
  menuItems,
  menuSubItems,
  menuTopTitle,
  navRightLabel,
  navToggleLabel,
} from "@/features/kpverse-menu/data/content";

export default function KpverseMenu() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const timeouts = new Set<number>();
    const intervals = new Set<number>();
    const after = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timeouts.delete(id);
        fn();
      }, ms);
      timeouts.add(id);
      return id;
    };

    const listeners: Array<[EventTarget, string, EventListener]> = [];
    const on = (el: EventTarget, type: string, handler: EventListener) => {
      el.addEventListener(type, handler);
      listeners.push([el, type, handler]);
    };

    const splitElements: Array<{ el: HTMLElement; text: string }> = [];
    const splitWordsChars = (el: HTMLElement) => {
      const original = el.textContent ?? "";
      splitElements.push({ el, text: original });
      el.textContent = "";
      original.split(/(\s+)/).forEach((part) => {
        if (part === "") return;
        if (/^\s+$/.test(part)) {
          el.appendChild(document.createTextNode(part));
          return;
        }
        const word = document.createElement("div");
        word.className = "word";
        word.style.display = "inline-block";
        for (const ch of part) {
          const charEl = document.createElement("div");
          charEl.className = "char";
          charEl.style.display = "inline-block";
          charEl.textContent = ch;
          word.appendChild(charEl);
        }
        el.appendChild(word);
      });
    };

    root
      .querySelectorAll<HTMLElement>(
        ".kpv-menu-item a, .kpv-menu-item span, .kpv-menu-title p, .kpv-menu-content p"
      )
      .forEach(splitWordsChars);

    const addShuffleEffect = (element: HTMLElement) => {
      const chars = Array.from(element.querySelectorAll<HTMLElement>(".char"));
      const originalText = chars.map((char) => char.textContent ?? "");
      const shuffleInterval = 10;
      const resetDelay = 75;
      const additionalDelay = 150;

      chars.forEach((char, index) => {
        after(() => {
          const interval = window.setInterval(() => {
            char.textContent = String.fromCharCode(
              97 + Math.floor(Math.random() * 26)
            );
          }, shuffleInterval);
          intervals.add(interval);

          after(() => {
            window.clearInterval(interval);
            intervals.delete(interval);
            char.textContent = originalText[index];
          }, resetDelay + index * additionalDelay);
        }, index * shuffleInterval);
      });
    };

    const colorChars = (chars: HTMLElement[]) => {
      chars.forEach((char, index) => {
        after(() => char.classList.add("char-active"), index * 50);
      });
    };
    const clearColorChars = (chars: HTMLElement[]) => {
      chars.forEach((char) => char.classList.remove("char-active"));
    };

    const items = Array.from(
      root.querySelectorAll<HTMLElement>(".kpv-menu-item")
    );

    items.forEach((item) => {
      const linkElement = item.querySelector<HTMLElement>(
        ".kpv-menu-item-link a"
      );
      if (linkElement) {
        const width = linkElement.offsetWidth;
        const bgHover = item.querySelector<HTMLElement>(
          ".kpv-menu-item-link .kpv-bg-hover"
        );
        if (bgHover) bgHover.style.width = `${width + 30}px`;
        const spanElement = item.querySelector<HTMLElement>("span");
        if (spanElement) spanElement.style.left = `${width + 40}px`;
      }

      const spanChars = Array.from(
        item.querySelectorAll<HTMLElement>("span .char")
      );

      if (linkElement) {
        on(linkElement, "mouseenter", () => colorChars(spanChars));
        on(linkElement, "mouseleave", () => clearColorChars(spanChars));
      }
    });

    const shuffleTargets = Array.from(
      root.querySelectorAll<HTMLElement>(
        ".kpv-menu-item, .kpv-menu-sub-item .kpv-menu-title, .kpv-menu-sub-item .kpv-menu-content"
      )
    );

    shuffleTargets.forEach((link) => {
      on(link, "mouseenter", (event) => {
        const target = (event.currentTarget as HTMLElement).querySelector<HTMLElement>(
          ".kpv-menu-item-link a, .kpv-menu-title p, .kpv-menu-content p"
        );
        if (target) addShuffleEffect(target);
        const spanElement = link.querySelector<HTMLElement>("span");
        if (spanElement) addShuffleEffect(spanElement);
      });
    });

    const shuffleAll = () => {
      shuffleTargets.forEach((link) => {
        const target = link.querySelector<HTMLElement>(
          ".kpv-menu-item-link a, .kpv-menu-title p, .kpv-menu-content p"
        );
        if (target) addShuffleEffect(target);
      });
    };

    const animateMenuItems = (direction: "in" | "out") => {
      items.forEach((item, index) => {
        after(() => {
          item.style.left = direction === "in" ? "0px" : "-100px";
        }, index * 50);
      });
    };

    const menuToggle = root.querySelector<HTMLElement>(".kpv-menu-toggle");
    const closeBtn = root.querySelector<HTMLElement>(".kpv-close-btn");
    const menuContainer = root.querySelector<HTMLElement>(".kpv-menu-container");

    if (menuToggle && menuContainer) {
      on(menuToggle, "click", () => {
        menuContainer.style.left = "0%";
        shuffleAll();
        animateMenuItems("in");
      });
    }
    if (closeBtn && menuContainer) {
      on(closeBtn, "click", () => {
        menuContainer.style.left = "-100%";
        animateMenuItems("out");
      });
    }

    return () => {
      listeners.forEach(([el, type, handler]) =>
        el.removeEventListener(type, handler)
      );
      timeouts.forEach((id) => window.clearTimeout(id));
      intervals.forEach((id) => window.clearInterval(id));
      splitElements.forEach(({ el, text }) => {
        el.textContent = text;
      });
    };
  }, []);

  return (
    <div ref={rootRef} className="kpv-page">
      <nav className="kpv-nav">
        <div className="kpv-menu-toggle">
          <p>{navToggleLabel}</p>
        </div>
        <p>{navRightLabel}</p>
      </nav>

      <div className="kpv-container">
        <div className="kpv-menu-container">
          <div className="kpv-menu">
            <div className="kpv-menu-main">
              <div className="kpv-menu-top">
                <div className="kpv-menu-top-title">
                  <p>{menuTopTitle}</p>
                </div>
                <div className="kpv-menu-top-content">
                  {menuItems.map((item) => (
                    <div
                      key={item.label}
                      className={`kpv-menu-item${item.active ? " kpv-active" : ""}`}
                    >
                      <div className="kpv-menu-item-link">
                        <div className="kpv-bg-hover"></div>
                        <a href="#">{item.label}</a>
                      </div>
                      <span>{item.meta}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="kpv-menu-bottom">
                {menuSubItems.map((sub) => (
                  <div key={sub.title} className="kpv-menu-sub-item">
                    <div className="kpv-menu-title">
                      <p>{sub.title}</p>
                    </div>
                    <div className="kpv-menu-content">
                      <p>{sub.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="kpv-menu-sidebar">
              <div className="kpv-close-btn">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </div>
              <div className="kpv-logo">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M3 4h18l-7 8.5V19l-4 2v-8.5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
