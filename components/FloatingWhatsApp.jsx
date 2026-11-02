import { waLink } from "@/lib/whatsapp";

export default function FloatingWhatsApp() {
  return (
    <a
      href={waLink("Hi Shafa's Dessert House! I'd like to order delicious brownies.")}
      target="_blank"
      rel="noopener noreferrer"
      className="float-wa-btn"
      aria-label="Chat on WhatsApp"
    >
      <i className="fab fa-whatsapp"></i>
      <span className="wa-tooltip">Chat with Shafa &amp; Order</span>
    </a>
  );
}
