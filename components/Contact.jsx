"use client";
import { useEffect, useState } from "react";
import { EMAIL, openWhatsApp } from "@/lib/whatsapp";
import { useUI } from "./UIProvider";

const EMPTY = { name: "", phone: "", date: "", diet: "Standard Recipe", items: "", notes: "" };

export default function Contact() {
  const { showToast } = useUI();
  const [form, setForm] = useState(EMPTY);
  const [minDate, setMinDate] = useState("");

  // Computed on the client to avoid server/client hydration mismatch
  useEffect(() => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    const iso = t.toISOString().split("T")[0];
    setMinDate(iso);
    setForm((f) => ({ ...f, date: iso }));
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const sendWhatsApp = () => {
    const { name, phone, date, diet, items, notes } = form;
    if (!name.trim() || !phone.trim() || !date || !items.trim()) {
      showToast("Please fill in Name, Phone, Date, and Items first!");
      return;
    }
    openWhatsApp(
      `Hi Shafa's Dessert House! I'd like to place a pre-order via your website:\n\n` +
        `👤 Name: ${name.trim()}\n📞 Phone: ${phone.trim()}\n📅 Required Date: ${date}\n🌿 Preference: ${diet}\n` +
        `🍰 Items Requested: ${items.trim()}\n` +
        (notes.trim() ? `📝 Special Notes/Address: ${notes.trim()}\n` : "") +
        `\nPlease confirm slot availability!`
    );
  };

  const sendEmail = (e) => {
    e.preventDefault();
    const { name, phone, date, diet, items, notes } = form;
    showToast(`Thank you ${name.trim()}! Opening your email client to send your inquiry...`);
    const subject = encodeURIComponent(`New Pre-Order Inquiry from ${name.trim()}`);
    const body = encodeURIComponent(
      `Name: ${name}\nPhone: ${phone}\nDate: ${date}\nPreference: ${diet}\nItems: ${items}\nNotes: ${notes}`
    );
    setTimeout(() => (window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`), 800);
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container contact-layout">
        <div className="contact-card">
          <span className="sub-tag"><i className="fas fa-comments"></i> Direct Concierge</span>
          <h3>Get In Touch with Shafa</h3>
          <p>
            Have a custom cake inquiry, celebration hamper requirement, or want to reserve your dessert batch in
            advance? Reach out directly via WhatsApp or phone.
          </p>

          <div className="contact-channels">
            <div className="channel-item">
              <div className="channel-icon"><i className="fas fa-phone-alt"></i></div>
              <div className="channel-info">
                <h5>Phone &amp; WhatsApp Concierge</h5>
                <a href="tel:+919043569743">+91 90435 69743</a>
              </div>
            </div>
            <div className="channel-item">
              <div className="channel-icon"><i className="fas fa-envelope"></i></div>
              <div className="channel-info">
                <h5>Email Address</h5>
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </div>
            </div>
            <div className="channel-item">
              <div className="channel-icon"><i className="fas fa-map-marker-alt"></i></div>
              <div className="channel-info">
                <h5>Bakery Studio Location</h5>
                <span>Artisanal Home Kitchen • Pre-Order Pickup &amp; Delivery</span>
              </div>
            </div>
            <div className="channel-item">
              <div className="channel-icon"><i className="fas fa-clock"></i></div>
              <div className="channel-info">
                <h5>Pre-Order Hours</h5>
                <span>Daily: 9:00 AM – 9:00 PM (Baking Fresh Every Day)</span>
              </div>
            </div>
          </div>

          <div className="social-tags">
            <a href="https://wa.me/919043569743" target="_blank" rel="noopener noreferrer" className="tag-pill">
              <i className="fab fa-whatsapp" style={{ color: "#25D366" }}></i> WhatsApp Us
            </a>
            <a
              href="#"
              className="tag-pill"
              onClick={(e) => { e.preventDefault(); showToast("Instagram: @shafasdesserthouse"); }}
            >
              <i className="fab fa-instagram" style={{ color: "#E1306C" }}></i> Instagram
            </a>
          </div>
        </div>

        <div className="form-panel">
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.85rem", color: "var(--chocolate-deep)", marginBottom: "0.5rem" }}>
            Pre-Order Inquiry
          </h3>
          <p style={{ fontSize: "0.95rem", color: "var(--chocolate-muted)", marginBottom: "2rem" }}>
            Fill out this form and choose whether to send it directly to WhatsApp for an instant response or email.
          </p>

          <form onSubmit={sendEmail}>
            <div className="form-duo">
              <div className="form-unit">
                <label htmlFor="clientName">Your Name *</label>
                <input id="clientName" type="text" className="form-field" placeholder="e.g. Fatima Zahra" required value={form.name} onChange={set("name")} />
              </div>
              <div className="form-unit">
                <label htmlFor="clientPhone">Phone Number *</label>
                <input id="clientPhone" type="tel" className="form-field" placeholder="e.g. 98765 43210" required value={form.phone} onChange={set("phone")} />
              </div>
            </div>

            <div className="form-duo">
              <div className="form-unit">
                <label htmlFor="clientDate">Desired Delivery/Pickup Date *</label>
                <input id="clientDate" type="date" className="form-field" required min={minDate} value={form.date} onChange={set("date")} />
              </div>
              <div className="form-unit">
                <label htmlFor="clientDiet">Dietary Preference</label>
                <select id="clientDiet" className="form-field" value={form.diet} onChange={set("diet")}>
                  <option value="Standard Recipe">Standard (Egg-based)</option>
                  <option value="100% Eggless / Pure Vegetarian">100% Eggless / Pure Vegetarian</option>
                  <option value="Less Sugar / Dark Cocoa Focused">Less Sweet / Dark Cocoa Focused</option>
                </select>
              </div>
            </div>

            <div className="form-unit">
              <label htmlFor="clientItems">Treats You Would Like to Order *</label>
              <input id="clientItems" type="text" className="form-field" placeholder="e.g. 1x Nutella Brownies (Full Box), 1x Dream Cake" required value={form.items} onChange={set("items")} />
            </div>

            <div className="form-unit">
              <label htmlFor="clientNotes">Special Requests / Delivery Address</label>
              <textarea id="clientNotes" className="form-field" rows={3} placeholder="Add custom birthday message, delivery area, or dietary notes..." value={form.notes} onChange={set("notes")} />
            </div>

            <div className="form-btn-row">
              <button type="button" className="btn-wa-submit" onClick={sendWhatsApp}>
                <i className="fab fa-whatsapp"></i> Send via WhatsApp
              </button>
              <button type="submit" className="btn-mail-submit">
                <i className="fas fa-paper-plane"></i> Send Email
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
