"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  Share2, 
  CheckCircle2,
  Receipt,
  Phone,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { getInvoices, getUser } from '@/lib/storage';
import { formatINR } from '@/lib/utils';
import { Invoice, User } from '@/types';
import { format } from 'date-fns';

export default function InvoiceDetails({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldPrint = searchParams.get('print') === 'true';
  
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [user, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const allInvoices = getInvoices();
    const foundInvoice = allInvoices.find(inv => inv.id === id);
    if (!foundInvoice) {
      router.push('/invoices');
      return;
    }
    setInvoice(foundInvoice);
    setUserData(getUser());
  }, [id, router]);

  useEffect(() => {
    if (invoice && user && shouldPrint) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [invoice, user, shouldPrint]);

  if (!invoice || !user) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      {/* Action Bar (Hidden on print) */}
      <div className="flex items-center justify-between no-print">
        <Button variant="ghost" asChild>
          <Link href="/invoices">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to History
          </Link>
        </Button>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Invoice
          </Button>
        </div>
      </div>

      {/* Invoice Card */}
      <Card className="bg-white border-0 shadow-lg print:shadow-none print:border-0 rounded-2xl overflow-hidden mb-12">
        <div id="printable-invoice" className="p-12 print:p-0">
          {/* Header */}
          <div className="flex justify-between items-start mb-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Receipt className="h-8 w-8 text-blue-600 print:text-black" />
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">{user.business}</h1>
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                {user.gstin && <p className="font-bold text-gray-700">GSTIN: {user.gstin}</p>}
                <p className="flex items-center gap-2"><Phone className="h-3 w-3" /> {user.phone}</p>
                <p className="flex items-center gap-2"><Mail className="h-3 w-3" /> {user.email}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-4xl font-black text-gray-100 print:text-gray-200 uppercase tracking-widest mb-1">TAX INVOICE</h2>
              <div className="space-y-1">
                <p className="text-lg font-bold text-gray-900">{invoice.number}</p>
                <p className="text-sm text-gray-500">{format(new Date(invoice.date), 'dd MMMM yyyy')}</p>
                <p className="text-xs text-gray-400">{format(new Date(invoice.date), 'hh:mm a')}</p>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Billing Info */}
          <div className="grid grid-cols-2 gap-12 mb-10">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Bill To</p>
              <div className="space-y-1">
                <p className="text-xl font-bold text-gray-900">{invoice.customerName || "Walk-in Customer"}</p>
                {invoice.customerPhone && (
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Phone className="h-3 w-3" /> {invoice.customerPhone}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Payment Info</p>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">Mode: {invoice.paymentMode}</p>
                <div className="flex items-center justify-end gap-1 text-green-600 font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>PAID IN FULL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border rounded-xl overflow-hidden mb-8">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 print:bg-gray-100 border-b">
                  <TableHead className="w-12 text-center text-gray-900 font-bold">#</TableHead>
                  <TableHead className="text-gray-900 font-bold">Item Description</TableHead>
                  <TableHead className="text-center text-gray-900 font-bold">Qty</TableHead>
                  <TableHead className="text-right text-gray-900 font-bold">Rate</TableHead>
                  <TableHead className="text-center text-gray-900 font-bold">GST%</TableHead>
                  <TableHead className="text-right text-gray-900 font-bold">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item, idx) => (
                  <TableRow key={idx} className="border-b last:border-0 h-16">
                    <TableCell className="text-center text-gray-500">{idx + 1}</TableCell>
                    <TableCell>
                      <p className="font-bold text-gray-900">{item.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">SKU: {item.sku}</p>
                    </TableCell>
                    <TableCell className="text-center font-medium">{item.quantity}</TableCell>
                    <TableCell className="text-right font-medium">{formatINR(item.price)}</TableCell>
                    <TableCell className="text-center text-gray-500 text-sm">{item.taxRate}%</TableCell>
                    <TableCell className="text-right font-bold text-gray-900">
                      {formatINR(item.price * item.quantity)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-12">
            <div className="w-80 space-y-3">
              <div className="flex justify-between text-sm text-gray-500 font-medium">
                <span>Sub-total (Excl. Tax)</span>
                <span>{formatINR(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 font-medium border-b pb-2">
                <span>Total GST</span>
                <span>{formatINR(invoice.tax)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-700 bg-gray-50 p-2 rounded-md">
                <span className="text-xs uppercase tracking-wider pt-1">CGST (approx.)</span>
                <span>{formatINR(invoice.tax / 2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-700 bg-gray-50 p-2 rounded-md">
                <span className="text-xs uppercase tracking-wider pt-1">SGST (approx.)</span>
                <span>{formatINR(invoice.tax / 2)}</span>
              </div>
              <div className="flex justify-between text-2xl font-black text-gray-900 bg-blue-50 print:bg-gray-100 p-4 rounded-xl items-center">
                <span className="text-sm uppercase tracking-widest">Total Amount</span>
                <span className="text-blue-700 print:text-black">{formatINR(invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center space-y-2 border-t pt-8">
            <p className="text-sm font-bold text-gray-900">Thank you for your business!</p>
            <p className="text-[10px] text-gray-400 italic">This is a computer-generated invoice and doesn't require a signature.</p>
            <div className="pt-6 flex items-center justify-center gap-2">
              <p className="text-xs text-gray-300">Powered by</p>
              <span className="text-xs font-black text-blue-300 print:text-gray-400 uppercase tracking-wider">QuickBill POS</span>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Bottom info for screen only */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 no-print">
        <div className="flex gap-4">
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
            <Share2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-blue-900">Share with Customer</h3>
            <p className="text-sm text-blue-700 mb-4">You can send this bill directly to customer's WhatsApp or Email.</p>
            <div className="flex gap-2">
              <Button size="sm" className="bg-blue-600">Send WhatsApp</Button>
              <Button size="sm" variant="outline" className="border-blue-200">Send Email</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
