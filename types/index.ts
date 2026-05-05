export interface User {
  business: string;
  name: string;
  email: string;
  phone: string;
  gstin?: string;
  plan: 'Starter' | 'Professional' | 'Enterprise';
  planPrice: number;
  trialEnds: string; // ISO date
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  taxRate: number; // 0, 5, 12, 18, 28
  stock: number;
}

export interface InvoiceItem extends Product {
  quantity: number;
}

export interface Invoice {
  id: string;
  number: string;
  date: string; // ISO date
  customerName?: string;
  customerPhone?: string;
  paymentMode: 'Cash' | 'UPI' | 'Card';
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
}
