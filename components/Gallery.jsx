"use client";
import { GALLERY, img } from "@/lib/data";
import { useUI } from "./UIProvider";

export default function Gallery() {
  const { openLightbox } = useUI();

  return (
    <section id="gallery" className="gallery-section">
      <div className="container">
        <div className="section-header" data-index="06">
          <h2 className="section-title">Our Culinary <em>Gallery</em></h2>
        </div>

        <div className="gallery-mosaic">
          {GALLERY.map((g) => (
            <button
              type="button"
              className="mosaic-tile"
              key={g.file}
              onClick={() => openLightbox(img(g.file), g.title, g.desc)}
              aria-label={`View details for ${g.tile}`}
            >
              <img src={img(g.file)} alt="" loading="lazy" />
              <span className="tile-overlay">
                <span className="tile-title">{g.tile}</span>
                <span className="tile-sub"><i className="fas fa-expand" aria-hidden="true"></i> View Details</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
