"use client";
import { MARQUEE, img } from "@/lib/data";
import { useUI } from "./UIProvider";

export default function Marquee() {
  const { openLightbox } = useUI();
  const items = [...MARQUEE, ...MARQUEE];

  return (
    <section className="marquee-section" aria-label="Brownie and cake highlights">
      <div className="marquee-track">
        {items.map((m, i) => (
          <button
            key={i}
            type="button"
            className="marquee-item"
            onClick={() => openLightbox(img(m.file), m.title, m.desc)}
            aria-label={`View ${m.name}`}
            aria-hidden={i >= MARQUEE.length ? "true" : undefined}
            tabIndex={i >= MARQUEE.length ? -1 : 0}
          >
            <img src={img(m.file)} alt="" loading="lazy" />
            <span className="marquee-caption"><span className="marquee-name">{m.name}</span></span>
          </button>
        ))}
      </div>
    </section>
  );
}
