"use client";
import { GALLERY, img } from "@/lib/data";
import { useUI } from "./UIProvider";

export default function Gallery() {
  const { openLightbox } = useUI();

  return (
    <section id="gallery" className="gallery-section">
      <div className="container">
        <div className="section-header">
          <span className="sub-tag"><i className="fas fa-camera"></i> Visual Treats</span>
          <h2 className="section-title">Our Culinary Gallery</h2>
          <p className="section-desc">
            A feast for your eyes. Click on any creation to view high-resolution photography and flavor notes.
          </p>
        </div>

        <div className="gallery-mosaic">
          {GALLERY.map((g) => (
            <div className="mosaic-tile" key={g.file} onClick={() => openLightbox(img(g.file), g.title, g.desc)}>
              <img src={img(g.file)} alt={g.title} loading="lazy" />
              <div className="tile-overlay">
                <h4 className="tile-title">{g.tile}</h4>
                <span className="tile-sub"><i className="fas fa-expand"></i> View Details</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
