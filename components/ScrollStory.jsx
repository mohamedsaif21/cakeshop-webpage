"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const q = (selector) => gsap.utils.toArray(selector);
const first = (selector) => q(selector)[0];

export default function ScrollStory() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let disposed = false;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const hero = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.08 });

        hero
          .from(".hero-pill", { y: 16, autoAlpha: 0, duration: 0.55 })
          .from(".hero h1", { y: 30, autoAlpha: 0, duration: 0.9 }, "-=0.32")
          .from(".hero-text > p", { y: 20, autoAlpha: 0, duration: 0.7 }, "-=0.55")
          .from(".hero-actions", { y: 18, autoAlpha: 0, duration: 0.6 }, "-=0.45")
          .from(".hero-proof", { y: 18, autoAlpha: 0, duration: 0.6 }, "-=0.4")
          .from(
            ".hero-cake-card",
            { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "power3.inOut" },
            "-=1.15"
          )
          .from(".hero-cake-card img", { scale: 1.14, duration: 1.3, ease: "power2.out" }, "<")
          .from(
            ".hero-stamp",
            { scale: 0.7, rotation: -12, autoAlpha: 0, duration: 0.7, ease: "back.out(1.6)" },
            "-=0.5"
          )
          .from(".hero-photo-caption", { y: 10, autoAlpha: 0, duration: 0.5 }, "-=0.35");

        const staggerIn = (targets, trigger, vars = {}) => {
          const items = q(targets);
          if (!items.length) return;

          gsap.from(items, {
            y: 26,
            autoAlpha: 0,
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: first(trigger) || items[0],
              start: "top 86%",
              once: true,
            },
            ...vars,
          });
        };

        q(".section-header").forEach((header) => {
          gsap.from(Array.from(header.children), {
            y: 22,
            autoAlpha: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: header, start: "top 88%", once: true },
          });
        });

        staggerIn(".trust-card", ".trust-grid", { y: 18, duration: 0.6, stagger: 0.07 });

        gsap.from(".about-frame", {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 1.1,
          ease: "power3.inOut",
          scrollTrigger: { trigger: first(".about-media-box"), start: "top 82%", once: true },
        });
        gsap.from(".about-frame img", {
          scale: 1.12,
          duration: 1.3,
          ease: "power2.out",
          scrollTrigger: { trigger: first(".about-media-box"), start: "top 82%", once: true },
        });
        gsap.from(".about-seal", {
          scale: 0.82,
          rotation: -8,
          autoAlpha: 0,
          duration: 0.7,
          ease: "back.out(1.5)",
          scrollTrigger: { trigger: first(".about-media-box"), start: "top 75%", once: true },
        });

        staggerIn(".filter-pill", ".menu-filter-nav", { y: 14, duration: 0.55, stagger: 0.05 });
        staggerIn(".pricing-head > *", ".pricing-section", { y: 18, duration: 0.6 });
        gsap.from(".table-responsive-box", {
          y: 20,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: first(".pricing-section"), start: "top 80%", once: true },
        });

        staggerIn(".box-size-card", ".box-size-cards", { y: 18, duration: 0.6, stagger: 0.08 });
        staggerIn(".flavor-card", ".flavors-picker-grid", { y: 18, duration: 0.6, stagger: 0.05 });
        gsap.from(".builder-aside", {
          y: 28,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: first(".builder-container"), start: "top 78%", once: true },
        });

        staggerIn(".step-block", ".steps-container", { y: 24, duration: 0.7, stagger: 0.12 });
        gsap.fromTo(
          ".steps-rule",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: first(".steps-container"),
              start: "top 85%",
              end: "bottom 60%",
              scrub: 0.6,
            },
          }
        );
        gsap.from(".savor-card", {
          y: 24,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: first(".savor-card"), start: "top 85%", once: true },
        });

        staggerIn(".review-box", ".reviews-grid", { y: 26, duration: 0.75, stagger: 0.1 });
        staggerIn(".mosaic-tile", ".gallery-mosaic", { y: 30, duration: 0.8, stagger: 0.09 });

        staggerIn(".contact-card, .form-panel", ".contact-layout", { y: 26, duration: 0.8, stagger: 0.12 });
        staggerIn(".footer-mosaic > *", ".footer-mosaic", { y: 20, duration: 0.6, stagger: 0.08 });

        gsap.to(".hero-cake-card img", {
          yPercent: -7,
          ease: "none",
          scrollTrigger: {
            trigger: first(".hero"),
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }, document.body);

      return () => ctx.revert();
    });

    const refresh = () => {
      if (!disposed) ScrollTrigger.refresh();
    };

    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      disposed = true;
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  }, []);

  return null;
}
