import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => fs.readFileSync(new URL(path, root), "utf8");
const load = (source) => import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

const whatsappSource = read("lib/whatsapp.js");
const cartSource = read("lib/cart.js").replace(
  /^import[^\n]*from\s+["']\.\/whatsapp["'];?\s*/m,
  ""
);

const whatsapp = await load(whatsappSource);
const cart = await load(`${whatsappSource}\n${cartSource}`);
const data = await load(read("lib/data.js"));

const classic = data.PRODUCTS.find((product) => product.id === "classic");
const nutella = data.PRODUCTS.find((product) => product.id === "nutella");

test("creates a cart item from an available product and portion", () => {
  const item = cart.createCartItem(classic, 0, 2);

  assert.equal(item.name, classic.name);
  assert.equal(item.size, "Half Box");
  assert.equal(item.pieces, "6 pcs");
  assert.equal(item.unitPrice, 499);
  assert.equal(item.quantity, 2);
  assert.ok(item.key.includes("classic"));
});

test("rejects unavailable products and invalid portions", () => {
  assert.equal(cart.createCartItem({ ...classic, status: "soldout" }, 0, 1), null);
  assert.equal(cart.createCartItem(classic, 9, 1), null);
  assert.equal(cart.createCartItem(null, 0, 1), null);
});

test("merges duplicate additions and keeps separate products", () => {
  const first = cart.addCartItem([], cart.createCartItem(classic, 0, 2));
  const duplicate = cart.addCartItem(first.items, cart.createCartItem(classic, 0, 3));

  assert.equal(duplicate.items.length, 1);
  assert.equal(duplicate.items[0].quantity, 5);
  assert.equal(duplicate.limited, false);

  const another = cart.addCartItem(duplicate.items, cart.createCartItem(nutella, 0, 1));

  assert.equal(another.items.length, 2);
  assert.equal(another.items[1].name, nutella.name);
});

test("clamps duplicate additions to the maximum quantity", () => {
  const result = cart.addCartItem(
    [{ ...cart.createCartItem(classic, 0, 1), quantity: 29 }],
    cart.createCartItem(classic, 0, 5)
  );

  assert.equal(result.items[0].quantity, whatsapp.MAX_QUANTITY);
  assert.equal(result.limited, true);
  assert.equal(
    cart.addCartItem([], { ...cart.createCartItem(classic, 0, 1), quantity: 99 }).items[0].quantity,
    whatsapp.MAX_QUANTITY
  );
});

test("updates and removes cart items with bounded quantities", () => {
  const item = cart.createCartItem(classic, 1, 2);

  assert.equal(cart.updateCartQuantity([item], item.key, 99)[0].quantity, whatsapp.MAX_QUANTITY);
  assert.equal(cart.updateCartQuantity([item], item.key, -4)[0].quantity, whatsapp.MIN_QUANTITY);
  assert.equal(cart.updateCartQuantity([item], "missing", 4)[0].quantity, 2);
  assert.equal(cart.removeCartItem([item], item.key).length, 0);
});

test("summarizes total item count and price", () => {
  const items = [
    cart.createCartItem(classic, 0, 2),
    cart.createCartItem(classic, 1, 1),
    cart.createCartItem(nutella, 1, 3),
  ];

  assert.deepEqual(cart.getCartSummary(items), { count: 6, total: 998 + 999 + 3 * 1279 });
});

test("builds an accurate WhatsApp review message using the configured number", () => {
  const items = [
    cart.createCartItem(classic, 0, 2),
    cart.createCartItem(classic, 1, 1),
  ];
  const message = whatsapp.buildCartOrderMessage(items);

  for (const expected of [
    classic.name,
    "Box size: Half Box",
    "Pieces: 6 pcs",
    "Quantity: 2",
    "Unit price: ₹499",
    "Subtotal: ₹998",
    "Box size: Full Box",
    "Pieces: 12 pcs",
    "Subtotal: ₹999",
    "Order total: ₹1,997",
  ]) {
    assert.ok(message.includes(expected), `message missing ${expected}`);
  }

  assert.ok(
    whatsapp.buildCartOrderMessage([{ ...items[0], quantity: 99 }]).includes(`Quantity: ${whatsapp.MAX_QUANTITY}`)
  );

  const link = whatsapp.waLink(message);
  assert.ok(link.startsWith(`https://wa.me/${whatsapp.PHONE}?text=`));
  assert.equal(decodeURIComponent(link.split("?text=")[1]), message);
});

test("wires the cart UI into the menu and app shell", () => {
  const menu = read("components/Menu.jsx");
  const cartUi = read("components/Cart.jsx");
  const provider = read("components/CartProvider.jsx");
  const layout = read("app/layout.js");
  const styles = read("app/globals.css");

  assert.ok(menu.includes("btn-add-cart"));
  assert.ok(menu.includes("addProduct(p, idx, quantity)"));
  assert.match(cartUi, /\{count > 0 && \(\s*<button[\s\S]*?className="cart-floating"/);
  assert.ok(cartUi.includes("cart-mobile-bar"));
  assert.ok(cartUi.includes("View Order"));
  assert.ok(cartUi.includes("cart-panel"));
  assert.ok(cartUi.includes("Your order box is empty"));
  assert.ok(cartUi.includes("Review Order"));
  assert.ok(cartUi.includes("updateQuantity(item.key"));
  assert.ok(cartUi.includes("removeItem(item.key)"));
  assert.ok(provider.includes("useCart"));
  assert.ok(layout.includes("<CartProvider>"));
  assert.ok(layout.includes("<Cart />"));
  assert.ok(styles.includes(".cart-mobile-bar"));
  assert.ok(styles.includes(".cart-panel"));
});
