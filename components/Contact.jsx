"use client";
import { useEffect, useState } from "react";
import { EMAIL, openWhatsApp } from "@/lib/whatsapp";
import { useUI } from "./UIProvider";

const EMPTY = { name: "", phone: "", date: "", diet: "Standard Recipe", items: "", notes: "" };

export default function Contact() {
  const { showToast } = useUI();
  const [form, setForm] = useState(EMPTY);
  const [minDate, setMinDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    const iso = t.toISOString().split("T")[0];
    setMinDate(iso);
    setForm((f) => ({ ...f, date: iso }));
  }, []);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (error) setError("");
  };

  const sendWhatsApp = () => {
    const { name, phone, date, diet, items, notes } = form;
    if (!name.trim() || !phone.trim() || !date || !items.trim()) {
      const message = "Please fill in Name, Phone, Date, and Items first!";
      setError(message);
      showToast(message);
      return;
    }
    setError("");
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
    if (!name.trim() || !phone.trim() || !date || !items.trim()) {
      const message = "Please fill in Name, Phone, Date, and Items first!";
      setError(message);
      showToast(message);
      return;
    }
    setError("");
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
          <span className="sub-tag"><i className="fas fa-comments" aria-hidden="true"></i> Direct Concierge</span>
          <h3>Get In Touch with Shafa</h3>
          <p>
            Have a custom cake inquiry, celebration hamper requirement, or want to reserve your dessert batch in
            advance? Reach out directly via WhatsApp or phone.
          </p>

          <div className="contact-channels">
            <div className="channel-item">
              <div className="channel-icon"><i className="fas fa-phone-alt" aria-hidden="true"></i></div>
              <div className="channel-info">
                <h5>Phone &amp; WhatsApp Concierge</h5>
                <a href="tel:+919043569743">+91 90435 69743</a>
              </div>
            </div>
            <div className="channel-item">
              <div className="channel-icon"><i className="fas fa-envelope" aria-hidden="true"></i></div>
              <div className="channel-info">
                <h5>Email Address</h5>
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </div>
            </div>
            <div className="channel-item">
              <div className="channel-icon"><i className="fas fa-map-marker-alt" aria-hidden="true"></i></div>
              <div className="channel-info">
                <h5>Bakery Studio Location</h5>
                <span>Artisanal Home Kitchen &middot; Pre-Order Pickup &amp; Delivery</span>
              </div>
            </div>
            <div className="channel-item">
              <div className="channel-icon"><i className="fas fa-clock" aria-hidden="true"></i></div>
              <div className="channel-info">
                <h5>Pre-Order Hours</h5>
                <span>Daily: 9:00 AM &ndash; 9:00 PM (Baking Fresh Every Day)</span>
              </div>
            </div>
          </div>

          <div className="social-tags">
            <a href="https://wa.me/919043569743" target="_blank" rel="noopener noreferrer" className="tag-pill">
              <i className="fab fa-whatsapp icon-wa" aria-hidden="true"></i> WhatsApp Us
            </a>
            <a
              href="#"
              className="tag-pill"
              onClick={(e) => { e.preventDefault(); showToast("Instagram: @shafasdesserthouse"); }}
            >
              <i className="fab fa-instagram icon-ig" aria-hidden="true"></i> Instagram
            </a>
          </div>
        </div>

        <div className="form-panel">
          <h3 className="panel-title">Pre-Order <em>Inquiry</em></h3>
          <p className="panel-intro">
            Fill out this form and choose whether to send it directly to WhatsApp for an instant response or email.
          </p>

          <form onSubmit={sendEmail} aria-describedby={error ? "form-error" : undefined} noValidate>
            <div className="form-duo">
              <div className="form-unit">
                <label htmlFor="clientName">Your Name *</label>
                <input id="clientName" type="text" className="form-field" placeholder="e.g. Fatima Zahra" required value={form.name} onChange={set("name")} aria-invalid={Boolean(error) && !form.name.trim()} />
              </div>
              <div className="form-unit">
                <label htmlFor="clientPhone">Phone Number *</label>
                <input id="clientPhone" type="tel" className="form-field" placeholder="e.g. 98765 43210" required value={form.phone} onChange={set("phone")} aria-invalid={Boolean(error) && !form.phone.trim()} />
              </div>
            </div>

            <div className="form-duo">
              <div className="form-unit">
                <label htmlFor="clientDate">Desired Delivery/Pickup Date *</label>
                <input id="clientDate" type="date" className="form-field" required min={minDate} value={form.date} onChange={set("date")} aria-invalid={Boolean(error) && !form.date} />
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
              <input id="clientItems" type="text" className="form-field" placeholder="e.g. 1x Nutella Brownies (Full Box), 1x Dream Cake" required value={form.items} onChange={set("items")} aria-invalid={Boolean(error) && !form.items.trim()} />
            </div>

            <div className="form-unit">
              <label htmlFor="clientNotes">Special Requests / Delivery Address</label>
              <textarea id="clientNotes" className="form-field" rows={3} placeholder="Add custom birthday message, delivery area, or dietary notes..." value={form.notes} onChange={set("notes")} />
            </div>

            {error && (
              <p id="form-error" className="form-error" role="alert">
                <i className="fas fa-circle-exclamation" aria-hidden="true"></i> {error}
              </p>
            )}

            <div className="form-btn-row">
              <button type="button" className="btn-wa-submit" onClick={sendWhatsApp}>
                <i className="fab fa-whatsapp" aria-hidden="true"></i> Send via WhatsApp
              </button>
              <button type="submit" className="btn-mail-submit">
                <i className="fas fa-paper-plane" aria-hidden="true"></i> Send Email
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
