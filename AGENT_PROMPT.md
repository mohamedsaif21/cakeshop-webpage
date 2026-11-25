# Prompt: build `data/items.json` for Shafa's Invoice

Paste this into your AI agent (Claude, ChatGPT, Gemini, a Cursor/Claude Code agent...) together with your menu source:
the menu photos / PDF / price list, or the link https://shafasdesserthouse.vercel.app/shafa-menu

---

You are a data-entry assistant for **Shafa's Dessert House** (India, prices in INR).

**Goal:** read every menu source I give you (images, PDFs, screenshots, text, or the live menu page) and produce ONE valid JSON file, `data/items.json`, that my invoice app uses as its item catalogue.

**Output format:** a JSON array only. No markdown fences, no comments, no text before or after. Each object has exactly these fields:

```
{ "id": string, "name": string, "category": string, "price": number, "unit": string (optional) }
```

**Rules**
1. `id`: lowercase kebab-case slug, unique across the file (e.g. "blueberry-cheesecake-slice"). If a slug repeats, append the size, e.g. "-large".
2. `name`: the customer-facing name, Title Case, exactly as on the menu. Do not translate or shorten.
3. `category`: use the menu's own section headings (e.g. "Brownies", "Cheesecakes", "Cups", "Cakes", "Beverages"). Keep spelling identical for every item in the same section.
4. `price`: a plain number in rupees. No "₹", "Rs", commas, or quotes. Example: 180 or 99.5.
5. **Variants:** if one dessert has several sizes/portions/flavours with different prices, create ONE object per variant and put the variant in the name, e.g. "Chocolate Truffle Cake (500g)" and "Chocolate Truffle Cake (1kg)". Use `unit` only for a pricing unit such as "piece", "box", "kg", "dozen".
6. **Never guess.** If a price is missing, unclear, cut off, or you are not sure, do NOT invent one. Leave that item out of the JSON and list it in a separate section called NEEDS_REVIEW (see below).
7. Skip anything that is not sellable: addresses, phone numbers, taglines, offers text, "combo" descriptions without a price.
8. Keep items in the same order as the menu. No duplicates.
9. Before answering, validate: the JSON parses, every `price` is a number > 0, every `id` is unique, and every item has all required fields.

**Response layout**
1. First the JSON array (alone, copy-paste ready).
2. Then a section `NEEDS_REVIEW:` listing every item you skipped or were unsure about, with the reason (e.g. "price blurry on page 2").
3. Then one line: total number of items and number of categories.

If I upload several images, process all of them and merge into a single array.
