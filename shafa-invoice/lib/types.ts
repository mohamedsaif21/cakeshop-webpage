export type CatalogItem = { id: string; name: string; category: string; price: number; unit?: string };
export type LineItem = { id: string; name: string; price: number; qty: number };

export type Invoice = {
  number: string;
  date: string; // YYYY-MM-DD
  customer: { name: string; phone: string; address: string };
  items: LineItem[];
  discount: number;
  delivery: number;
  payment: string;
  notes: string;
  subtotal: number;
  total: number;
};
