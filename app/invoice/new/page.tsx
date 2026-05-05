"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart, 
  User, 
  Phone, 
  CreditCard,
  Printer,
  Receipt,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { getProducts, addInvoice, getInvoices } from '@/lib/storage';
import { formatINR, generateInvoiceNumber, cn } from '@/lib/utils';
import { Product, InvoiceItem, Invoice } from '@/types';
import { toast } from 'sonner';

export default function NewInvoicePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<InvoiceItem[]>([]);
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Card'>('UPI');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [lastInvoiceId, setLastInvoiceId] = useState<string | null>(null);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast.error("Product out of stock");
      return;
    }

    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        toast.error("Cannot add more than available stock");
        return;
      }
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const product = products.find(p => p.id === productId);
        const newQty = item.quantity + delta;
        if (newQty > 0 && product && newQty <= product.stock) {
          return { ...item, quantity: newQty };
        }
      }
      return item;
    }));
  };

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = cart.reduce((sum, item) => {
      const itemTax = (item.price * item.quantity * (item.taxRate / 100));
      return sum + itemTax;
    }, 0);
    return {
      subtotal,
      tax,
      total: subtotal + tax
    };
  }, [cart]);

  const handleSubmit = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    const existingInvoices = getInvoices();
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      number: generateInvoiceNumber(existingInvoices.length),
      date: new Date().toISOString(),
      customerName: customer.name,
      customerPhone: customer.phone,
      paymentMode,
      items: cart,
      ...totals
    };

    addInvoice(newInvoice);
    setLastInvoiceId(newInvoice.id);
    setIsPreviewOpen(true);
    toast.success("Invoice created successfully");
  };

  const handlePrint = () => {
    router.push(`/invoices/${lastInvoiceId}?print=true`);
  };

  const handleContinue = () => {
    router.push('/invoices');
  };

  return (
    <div className="flex h-full min-h-[calc(100vh-64px)] overflow-hidden">
      {/* Product Selection (Left) */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Invoice</h1>
            <p className="text-sm text-gray-500">Pick products to add to bill</p>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search products..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto pr-2 pb-6">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="cursor-pointer hover:border-blue-500 hover:shadow-md transition-all group"
                onClick={() => addToCart(product)}
              >
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-mono text-gray-400">{product.sku}</span>
                    <Badge variant="outline" className="text-[10px] py-0">{product.category}</Badge>
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-blue-600">
                    {product.name}
                  </h3>
                  <div className="flex items-end justify-between mt-2">
                    <div className="text-lg font-bold text-blue-700">
                      {formatINR(product.price)}
                    </div>
                    <div className={cn(
                      "text-[10px] font-medium",
                      product.stock > 10 ? "text-green-600" : "text-orange-600"
                    )}>
                      {product.stock} in stock
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Cart (Right) */}
      <div className="w-[400px] bg-white border-l flex flex-col shrink-0 shadow-xl z-10">
        <div className="p-6 border-b flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-gray-600" />
            <h2 className="font-bold">Current Cart</h2>
          </div>
          <Badge className="bg-blue-600">{cart.length} Items</Badge>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-4">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.id} className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg group">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 truncate pr-2">{item.name}</p>
                    <p className="text-xs text-gray-500">{formatINR(item.price)} + {item.taxRate}% GST</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-gray-400 hover:text-red-600"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border bg-white rounded-md h-8">
                    <button 
                      className="px-2 hover:bg-gray-100 h-full border-r"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button 
                      className="px-2 hover:bg-gray-100 h-full border-l"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="font-bold text-gray-900">
                    {formatINR(item.price * item.quantity)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
              <ShoppingBag className="h-12 w-12 mb-4 opacity-20" />
              <p>Your cart is empty.</p>
              <p className="text-xs">Click products on the left to add items.</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t space-y-4">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[10px] text-gray-500 uppercase">Customer Name</Label>
                <div className="relative">
                  <User className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                  <Input 
                    placeholder="Optional" 
                    className="pl-8 h-8 text-xs bg-white" 
                    value={customer.name}
                    onChange={(e) => setCustomer({...customer, name: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-gray-500 uppercase">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                  <Input 
                    placeholder="Optional" 
                    className="pl-8 h-8 text-xs bg-white" 
                    value={customer.phone}
                    onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                    maxLength={10}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-500 uppercase">Payment Mode</Label>
              <Select value={paymentMode} onValueChange={(v: any) => setPaymentMode(v)}>
                <SelectTrigger className="h-8 text-xs bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UPI">UPI Payment</SelectItem>
                  <SelectItem value="Cash">Cash Sale</SelectItem>
                  <SelectItem value="Card">Card Swipe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-500 font-medium">
              <span>Subtotal</span>
              <span>{formatINR(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 font-medium">
              <span>GST Total</span>
              <span>{formatINR(totals.tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-black text-gray-900 pt-1">
              <span>Total Bill</span>
              <span className="text-blue-700">{formatINR(totals.total)}</span>
            </div>
          </div>

          <Button 
            className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700" 
            disabled={cart.length === 0}
            onClick={handleSubmit}
          >
            Create & Print Invoice
          </Button>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center mb-4">
              <Receipt className="h-10 w-10 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold mb-2">Invoice Created!</DialogTitle>
            <DialogDescription className="text-gray-500">
              Invoice #{lastInvoiceId ? getInvoices().find(i => i.id === lastInvoiceId)?.number : ''} has been successfully generated and stock has been updated.
            </DialogDescription>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1" onClick={handleContinue}>
              Go to History
            </Button>
            <Button className="flex-1 bg-blue-600" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ShoppingBag(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}
