import { NAV_LINKS } from "@/lib/data";
import { EMAIL } from "@/lib/whatsapp";

const HIGHLIGHTS = [
  "Classic Fudgy Brownies", "Nutella Swirl Brownies", "Bombshell Oreo Brownies",
  "Blonde Brownies (Haole)", "Tin Can Dream Cake", "12-Brownie Sampler Box",
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-mosaic">
          <div className="footer-brand-box">
            <h4>Shafa&apos;s Dessert House</h4>
            <p>
              Artisanal home-baked goodness crafted with love, pure butter, and premium cocoa. Bringing smiles to
              celebrations across the city one fresh batch at a time.
            </p>
            <div className="footer-socials">
              <a href="https://wa.me/919043569743" target="_blank" rel="noopener noreferrer" className="tag-pill">
                <i className="fab fa-whatsapp icon-wa" aria-hidden="true"></i> WhatsApp
              </a>
              <a href="tel:+919043569743" className="tag-pill">
                <i className="fas fa-phone-alt" aria-hidden="true"></i> Call Us
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h5>Quick Links</h5>
            <ul className="footer-nav">
              {NAV_LINKS.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
            </ul>
          </div>

          <div className="footer-column">
            <h5>Menu Highlights</h5>
            <ul className="footer-nav">
              {HIGHLIGHTS.map((h) => <li key={h}><a href="#menu">{h}</a></li>)}
            </ul>
          </div>

          <div className="footer-column">
            <h5>Pre-Order Policy</h5>
            <div className="footer-notice">
              <h6>Small Batch Baking</h6>
              <p>
                Every item is baked fresh strictly to order. Please book at least <strong>24 to 48 hours</strong> in
                advance to secure your baking slot.
              </p>
            </div>
            <p className="footer-contact">
              <i className="fas fa-envelope" aria-hidden="true"></i> {EMAIL}<br />
              <i className="fas fa-phone-alt" aria-hidden="true"></i> +91 90435 69743
            </p>
          </div>
        </div>

        <div className="footer-credits">
          <p>&copy; {new Date().getFullYear()} Shafa&apos;s Dessert House. All Rights Reserved. Handcrafted with care and pure cocoa.</p>
          <p>Pre-Order Artisanal Bakery &middot; Quality Guaranteed</p>
        </div>
      </div>
    </footer>
  );
}
