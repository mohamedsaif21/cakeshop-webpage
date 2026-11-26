import { MAX_QUANTITY, PHONE, formatPrice } from "@/lib/whatsapp";

export const INSTAGRAM = "shafasdesserthouse";
export const LOGO_SRC = "/shafa-menu/logo.png";
export const WHATSAPP_NUMBER = PHONE;
export const STORAGE_KEY = "shafa-cart-v1";
export const PREFS_STORAGE_KEY = "shafa-cart-prefs-v1";
export const MAX_ITEM_QTY = MAX_QUANTITY;

export type Size = "half" | "full";
export type Cat = "brownies" | "cakes";
export type FilterTab = "all" | Cat | "blondies";
export type SortMode = "featured" | "price-asc" | "price-desc";
export type DietaryOption = "Standard" | "100% Eggless";
export type PackagingOption = "Signature Box" | "Gift Ribbon & Card";

export type ItemCustomization = {
  dietary: DietaryOption;
  packaging: PackagingOption;
  itemNote: string;
};

export const DEFAULT_CUSTOMIZATION: ItemCustomization = {
  dietary: "Standard",
  packaging: "Signature Box",
  itemNote: "",
};

export type MenuItem = {
  id: string;
  name: string;
  cat: Cat;
  isBlondie?: boolean;
  half: number;
  full: number;
  badge?: string;
  shortDesc: string;
  about: string;
  halfLabel: string;
  fullLabel: string;
  photo?: string;
};

export type CartLine = {
  key: string;
  item: MenuItem;
  size: Size;
  qty: number;
  price: number;
  prefs: ItemCustomization;
};

export const ITEMS: MenuItem[] = [
  {
    id: "normal-brownie",
    name: "Normal Brownie",
    cat: "brownies",
    half: 499,
    full: 999,
    badge: "Classic",
    shortDesc: "Intense dark chocolate with a crisp crinkle top and dense fudgy center.",
    about:
      "Our hallmark brownie baked in small batches with pure dairy butter and rich cocoa, yielding an authentic paper-thin crinkle top and melt-in-your-mouth fudgy middle.",
    halfLabel: "Half Box · 6 pcs",
    fullLabel: "Full Box · 12 pcs",
    photo: "/assest/Menu Highlights/The Best Brownies Ever.jpeg",
  },
  {
    id: "triple-choc-brownies",
    name: "Triple Chocolate Brownies",
    cat: "brownies",
    half: 649,
    full: 1299,
    badge: "Signature",
    shortDesc: "Three rich layers of dark fudge, silky milk ganache, and white chocolate.",
    about:
      "Three decadent tiers of chocolate indulgence: a deep dark fudge base, velvety milk chocolate ganache layer, and creamy white chocolate swirl finished by hand.",
    halfLabel: "Half Box · 6 pcs",
    fullLabel: "Full Box · 12 pcs",
    photo: "/assest/Menu Highlights/Ultimate Triple Layer Brownies Recipe.jpeg",
  },
  {
    id: "blonde-brownies",
    name: "Blonde Brownies",
    cat: "brownies",
    isBlondie: true,
    half: 549,
    full: 1099,
    shortDesc: "Browned butter & golden brown sugar with caramel butterscotch notes.",
    about:
      "Golden chewy blondies crafted with caramelized browned butter, molasses brown sugar, and pure vanilla for a warm butterscotch finish.",
    halfLabel: "Half Box · 6 pcs",
    fullLabel: "Full Box · 12 pcs",
    photo: "/assest/Menu Highlights/Haole Brownies AKA Blonde Brownies.jpeg",
  },
  {
    id: "triple-choc-blondies",
    name: "Triple Chocolate Blondies",
    cat: "brownies",
    isBlondie: true,
    half: 699,
    full: 1399,
    badge: "Indulgent",
    shortDesc: "Chewy golden blondie studded with dark, milk, and white chocolate chunks.",
    about:
      "Our buttery golden blondie batter loaded with a trio of dark, milk, and white chocolate chunks that bake into pockets of molten sweetness.",
    halfLabel: "Half Box · 6 pcs",
    fullLabel: "Full Box · 12 pcs",
    photo: "/assest/Menu Highlights/12 Amazing Brownies That Will Make You Drool.jpeg",
  },
  {
    id: "fruits-nuts-brownie",
    name: "Fruits & Nuts Brownie",
    cat: "brownies",
    half: 599,
    full: 1199,
    shortDesc: "Fudgy cocoa brownie loaded with toasted almonds, cashews, and berries.",
    about:
      "Rich dark cocoa batter generously folded with roasted nuts and sweet dried fruit accents for satisfying crunch in every fudgy square.",
    halfLabel: "Half Box · 6 pcs",
    fullLabel: "Full Box · 12 pcs",
    photo: "/assest/Menu Highlights/Bombshell Oreo Brownies.jpeg",
  },
  {
    id: "nutella-brownies",
    name: "Nutella Brownies",
    cat: "brownies",
    half: 639,
    full: 1279,
    badge: "Bestseller",
    shortDesc: "Gooey cocoa brownie generously swirled with molten Nutella hazelnut cream.",
    about:
      "Fudgy cocoa batter heavily swirled with real Nutella hazelnut spread. Warm for 12–15 seconds before serving for an ultra-gooey molten center.",
    halfLabel: "Half Box · 6 pcs",
    fullLabel: "Full Box · 12 pcs",
    photo: "/assest/Menu Highlights/Soft and Gooey Nutella Brownies - Strawberry in the Desert.jpeg",
  },
  {
    id: "dream-cake",
    name: "Dream Cake",
    cat: "cakes",
    half: 639,
    full: 1279,
    badge: "Bestseller",
    shortDesc: "5 luxurious layers of chocolate sponge, mousse, fudge & crisp crack shell.",
    about:
      "Five irresistible layers in one indulgent treat: moist chocolate sponge, silky chocolate cream, gooey fudge, a crisp chocolate crack shell, and rich cocoa dusting.",
    halfLabel: "Half Portion",
    fullLabel: "Full Portion",
    photo: "/assest/Menu Highlights/Tin Can Chocolate Dream Cake Filipino Recipe.jpeg",
  },
  {
    id: "red-velvet-cake",
    name: "Red Velvet Cake",
    cat: "cakes",
    half: 399,
    full: 799,
    shortDesc: "Velvety crimson sponge with gentle cocoa and tangy cream cheese frosting.",
    about:
      "Traditional buttermilk red velvet sponge with subtle cocoa warmth, paired with whipped cream cheese frosting for a light yet regal celebration cake.",
    halfLabel: "Half Portion",
    fullLabel: "Full Portion",
    photo: "/assest/Menu Highlights/Red Velvet Cake.jpeg",
  },
  {
    id: "black-forest-cake",
    name: "Black Forest Cake",
    cat: "cakes",
    half: 399,
    full: 749,
    shortDesc: "Rich chocolate sponge layered with dairy cream, cherries & dark curls.",
    about:
      "Soft cocoa sponge layers brushed delicately, filled with fresh whipped dairy cream and juicy cherries, and finished with dark chocolate curls.",
    halfLabel: "Half Portion",
    fullLabel: "Full Portion",
  },
  {
    id: "white-forest-cake",
    name: "White Forest Cake",
    cat: "cakes",
    half: 399,
    full: 749,
    shortDesc: "Fluffy vanilla sponge with whipped cream, cherries & white chocolate curls.",
    about:
      "Airy vanilla sponge layered with pure dairy cream, tart cherries, and delicate white chocolate shavings for a bright, creamy gateau.",
    halfLabel: "Half Portion",
    fullLabel: "Full Portion",
    photo: "/assest/Menu Highlights/White Forest Cake.jpeg",
  },
  {
    id: "plum-cake",
    name: "Plum Cake",
    cat: "cakes",
    half: 449,
    full: 849,
    badge: "Heritage",
    shortDesc: "Spiced rich fruit cake baked with soaked dry fruits & caramelized warmth.",
    about:
      "Handcrafted spiced plum cake packed with plump soaked raisins, cashews, warm cinnamon-nutmeg notes, and a deeply caramelized crumb.",
    halfLabel: "Half Portion",
    fullLabel: "Full Portion",
  },
];

export type CategoryCard = {
  id: FilterTab;
  label: string;
  count: number;
  photo: string;
};

export const CATEGORY_CARDS: CategoryCard[] = [
  {
    id: "all",
    label: "All Treats",
    count: ITEMS.length,
    photo: "/assest/Menu Highlights/12 Amazing Brownies That Will Make You Drool.jpeg",
  },
  {
    id: "brownies",
    label: "Brownies",
    count: ITEMS.filter((i) => i.cat === "brownies").length,
    photo: "/assest/Menu Highlights/Soft and Gooey Nutella Brownies - Strawberry in the Desert.jpeg",
  },
  {
    id: "blondies",
    label: "Blondies",
    count: ITEMS.filter((i) => i.isBlondie).length,
    photo: "/assest/Menu Highlights/Haole Brownies AKA Blonde Brownies.jpeg",
  },
  {
    id: "cakes",
    label: "Cakes",
    count: ITEMS.filter((i) => i.cat === "cakes").length,
    photo: "/assest/Menu Highlights/Tin Can Chocolate Dream Cake Filipino Recipe.jpeg",
  },
];

export type PromoSlide = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  itemId: string;
  photo: string;
  tag: string;
};

export const PROMO_SLIDES: PromoSlide[] = [
  {
    id: "dream-cake",
    eyebrow: "Baked Fresh · 100% Eggless Available",
    title: "5-Layer Chocolate Dream Cake",
    subtitle: "Crack through the crisp chocolate shell into velvety mousse, fudge, and moist sponge.",
    cta: "Customize Dream Cake",
    itemId: "dream-cake",
    photo: "/assest/Menu Highlights/Tin Can Chocolate Dream Cake Filipino Recipe.jpeg",
    tag: "From ₹639",
  },
  {
    id: "nutella",
    eyebrow: "Bestseller · Small-Batch Crafted",
    title: "Molten Nutella Swirl Brownies",
    subtitle: "Deep cocoa fudginess swirled with warm hazelnut cream. Available in Half & Full boxes.",
    cta: "Customize Brownies",
    itemId: "nutella-brownies",
    photo: "/assest/Menu Highlights/Soft and Gooey Nutella Brownies - Strawberry in the Desert.jpeg",
    tag: "From ₹639",
  },
  {
    id: "triple-choc",
    eyebrow: "Gift Ready · Complimentary Ribbon & Card",
    title: "Triple Chocolate Layers",
    subtitle: "Dark, milk, and white chocolate balanced for celebrations and thoughtful gifting.",
    cta: "View Triple Choc",
    itemId: "triple-choc-brownies",
    photo: "/assest/Menu Highlights/Ultimate Triple Layer Brownies Recipe.jpeg",
    tag: "From ₹649",
  },
];

export const DIETARY_OPTIONS: DietaryOption[] = ["Standard", "100% Eggless"];
export const PACKAGING_OPTIONS: PackagingOption[] = ["Signature Box", "Gift Ribbon & Card"];

export const inr = (n: number) => formatPrice(n);

export function hasCustomPrefs(prefs?: ItemCustomization): boolean {
  if (!prefs) return false;
  return (
    prefs.dietary !== DEFAULT_CUSTOMIZATION.dietary ||
    prefs.packaging !== DEFAULT_CUSTOMIZATION.packaging ||
    prefs.itemNote.trim().length > 0
  );
}

export function formatPrefsSummary(prefs?: ItemCustomization): string {
  if (!prefs) return "";
  const parts: string[] = [];
  if (prefs.dietary !== "Standard") parts.push(prefs.dietary);
  if (prefs.packaging !== "Signature Box") parts.push(`${prefs.packaging} (Complimentary)`);
  if (prefs.itemNote.trim()) parts.push(`Note: ${prefs.itemNote.trim()}`);
  return parts.join(" · ");
}

export function buildWhatsAppOrderText(
  lines: CartLine[],
  total: number,
  customerName: string,
  orderNote: string
): string {
  const body = lines
    .map((l, i) => {
      const sizeText = l.size === "half" ? "Half" : "Full";
      const customText = formatPrefsSummary(l.prefs);
      return (
        `${i + 1}. ${l.item.name} (${sizeText}) × ${l.qty} = ${inr(l.qty * l.price)}` +
        (customText ? `\n   • ${customText}` : "")
      );
    })
    .join("\n");

  return (
    `*New Order – Shafa's Dessert House*\n\n${body}\n\n*Total: ${inr(total)}*` +
    (customerName.trim() ? `\n\nName: ${customerName.trim()}` : "") +
    (orderNote.trim() ? `\nNote: ${orderNote.trim()}` : "")
  );
}
