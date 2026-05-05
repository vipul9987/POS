import { User, Product, Invoice } from "@/types";

const STORAGE_KEYS = {
  USER: 'quickbill_user',
  PRODUCTS: 'quickbill_products',
  INVOICES: 'quickbill_invoices',
};

// Seed Data
export const SEED_PRODUCTS: Product[] = [
  { id: '1', sku: 'TSH001', name: 'Cotton T-Shirt (Blue, M)', category: 'Apparel', price: 599, taxRate: 5, stock: 25 },
  { id: '2', sku: 'TSH002', name: 'Cotton T-Shirt (Black, L)', category: 'Apparel', price: 599, taxRate: 5, stock: 18 },
  { id: '3', sku: 'JNS001', name: 'Slim Fit Jeans (Blue, 32)', category: 'Apparel', price: 1499, taxRate: 5, stock: 12 },
  { id: '4', sku: 'KRT001', name: 'Cotton Kurta (White, M)', category: 'Apparel', price: 899, taxRate: 5, stock: 20 },
  { id: '5', sku: 'BAG001', name: 'Leather Wallet (Brown)', category: 'Accessories', price: 799, taxRate: 18, stock: 30 },
  { id: '6', sku: 'WAT001', name: 'Wrist Watch (Steel)', category: 'Accessories', price: 2999, taxRate: 18, stock: 8 },
  { id: '7', sku: 'SHO001', name: 'Sports Shoes (Size 9)', category: 'Footwear', price: 2499, taxRate: 18, stock: 15 },
  { id: '8', sku: 'SHO002', name: 'Casual Loafers (Size 8)', category: 'Footwear', price: 1799, taxRate: 18, stock: 10 },
];

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const setUser = (user: User) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  // Initialize seed products if none exist
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    setProducts(SEED_PRODUCTS);
  }
};

export const clearUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

export const getProducts = (): Product[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return data ? JSON.parse(data) : [];
};

export const setProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

export const getInvoices = (): Invoice[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.INVOICES);
  return data ? JSON.parse(data) : [];
};

export const setInvoices = (invoices: Invoice[]) => {
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
};

export const addInvoice = (invoice: Invoice) => {
  const invoices = getInvoices();
  setInvoices([invoice, ...invoices]);
  
  // Decrement stock
  const products = getProducts();
  const updatedProducts = products.map(p => {
    const item = invoice.items.find(i => i.id === p.id);
    if (item) {
      return { ...p, stock: p.stock - item.quantity };
    }
    return p;
  });
  setProducts(updatedProducts);
};
