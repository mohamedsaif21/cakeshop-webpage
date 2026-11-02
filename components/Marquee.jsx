"use client";
import { MARQUEE, img } from "@/lib/data";
import { useUI } from "./UIProvider";

export default function Marquee() {
  const { openLightbox } = useUI();
  // Duplicate the full set so the -50% translate loops seamlessly
  const items = [...MARQUEE, ...MARQUEE];

  return (
    <div className="marquee-section">
      <div className="marquee-track">
        {items.map((m, i) => (
          <div
            key={i}
            className="marquee-item"
            onClick={() => openLightbox(img(m.file), m.title, m.desc)}
            aria-hidden={i >= MARQUEE.length}
          >
            <img src={img(m.file)} alt={m.title} loading="lazy" />
            <div className="marquee-caption"><div className="marquee-name">{m.name}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}
