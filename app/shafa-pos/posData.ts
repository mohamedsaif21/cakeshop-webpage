export type PosSection =
  | "dashboard"
  | "menu"
  | "billing"
  | "orders"
  | "tables"
  | "customers"
  | "loyalty"
  | "settings";

export type PosSize = "half" | "full";
export type PosCategory = "all" | "brownies" | "blondies" | "cakes";
export type PaymentMethod = "UPI" | "Cash" | "Card" | "Unpaid";

export type PosProduct = {
  id: string;
  name: string;
  cat: "brownies" | "cakes";
  isBlondie?: boolean;
  popular?: boolean;
  half: number;
  full: number;
  photo?: string;
};

export type BillLine = {
  key: string;
  productId: string;
  name: string;
  size: PosSize;
  unitPrice: number;
  qty: number;
  photo?: string;
};

export type PosOrderRecord = {
  id: string;
  createdAt: string;
  status: "charged" | "draft";
  tableLabel: string;
  payment: PaymentMethod;
  customerName: string;
  customerPhone: string;
  note: string;
  lines: BillLine[];
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
};

export const POS_ORDERS_KEY = "sdh-pos-orders-v1";
export const POS_DRAFT_KEY = "sdh-pos-active-bill-v1";
export const PAYMENT_METHODS: PaymentMethod[] = ["UPI", "Cash", "Card", "Unpaid"];
export const TABLE_OPTIONS = [
  "Takeaway",
  "Table 01",
  "Table 02",
  "Table 03",
  "Table 04",
  "Table 05",
  "Pre-Order",
];

export const POS_PRODUCTS: PosProduct[] = [
  {
    id: "normal-brownie",
    name: "Normal Brownie",
    cat: "brownies",
    popular: true,
    half: 499,
    full: 999,
    photo: "/assest/Menu Highlights/The Best Brownies Ever.jpeg",
  },
  {
    id: "triple-choc-brownies",
    name: "Triple Chocolate Brownies",
    cat: "brownies",
    popular: true,
    half: 649,
    full: 1299,
    photo: "/assest/Menu Highlights/Ultimate Triple Layer Brownies Recipe.jpeg",
  },
  {
    id: "blonde-brownies",
    name: "Blonde Brownies",
    cat: "brownies",
    isBlondie: true,
    half: 549,
    full: 1099,
    photo: "/assest/Menu Highlights/Haole Brownies AKA Blonde Brownies.jpeg",
  },
  {
    id: "triple-choc-blondies",
    name: "Triple Chocolate Blondies",
    cat: "brownies",
    isBlondie: true,
    half: 699,
    full: 1399,
    photo: "/assest/Menu Highlights/12 Amazing Brownies That Will Make You Drool.jpeg",
  },
  {
    id: "fruits-nuts-brownie",
    name: "Fruits & Nuts Brownie",
    cat: "brownies",
    half: 599,
    full: 1199,
    photo: "/assest/Menu Highlights/Bombshell Oreo Brownies.jpeg",
  },
  {
    id: "nutella-brownies",
    name: "Nutella Brownies",
    cat: "brownies",
    popular: true,
    half: 639,
    full: 1279,
    photo: "/assest/Menu Highlights/Soft and Gooey Nutella Brownies - Strawberry in the Desert.jpeg",
  },
  {
    id: "dream-cake",
    name: "Dream Cake",
    cat: "cakes",
    popular: true,
    half: 639,
    full: 1279,
    photo: "/assest/Menu Highlights/Tin Can Chocolate Dream Cake Filipino Recipe.jpeg",
  },
  {
    id: "red-velvet-cake",
    name: "Red Velvet Cake",
    cat: "cakes",
    half: 399,
    full: 799,
    photo: "/assest/Menu Highlights/Red Velvet Cake.jpeg",
  },
  {
    id: "black-forest-cake",
    name: "Black Forest Cake",
    cat: "cakes",
    half: 399,
    full: 749,
  },
  {
    id: "white-forest-cake",
    name: "White Forest Cake",
    cat: "cakes",
    half: 399,
    full: 749,
    photo: "/assest/Menu Highlights/White Forest Cake.jpeg",
  },
  {
    id: "plum-cake",
    name: "Plum Cake",
    cat: "cakes",
    half: 449,
    full: 849,
  },
];

export const POS_CATEGORIES: { id: PosCategory; label: string; count: number }[] = [
  { id: "all", label: "All Items", count: POS_PRODUCTS.length },
  { id: "brownies", label: "Brownies", count: POS_PRODUCTS.filter((p) => p.cat === "brownies").length },
  { id: "blondies", label: "Blondies", count: POS_PRODUCTS.filter((p) => p.isBlondie).length },
  { id: "cakes", label: "Cakes", count: POS_PRODUCTS.filter((p) => p.cat === "cakes").length },
];
