"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Search, 
  Eye, 
  Printer, 
  Download,
  Calendar,
  IndianRupee,
  Receipt
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getInvoices } from '@/lib/storage';
import { formatINR } from '@/lib/utils';
import { Invoice } from '@/types';
import { format } from 'date-fns';

export default function InvoicesListPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setInvoices(getInvoices());
  }, []);

  const filteredInvoices = invoices.filter(inv => 
    inv.number.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (inv.customerName && inv.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (inv.customerPhone && inv.customerPhone.includes(searchTerm))
  );

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoice History</h1>
          <p className="text-gray-500">View, search, and reprint your past bills.</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/invoice/new">Create New Invoice</Link>
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3 border-b border-gray-50/50">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search by invoice #, customer name or phone..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-9 px-4 font-medium text-gray-500">
                Total: {filteredInvoices.length} Invoices
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="w-[180px]">Invoice #</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <TableRow key={inv.id} className="hover:bg-gray-50/30">
                    <TableCell className="font-bold text-blue-700">{inv.number}</TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{format(new Date(inv.date), 'dd MMM yyyy')}</div>
                      <div className="text-xs text-gray-400">{format(new Date(inv.date), 'hh:mm a')}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium text-gray-900">{inv.customerName || "Walk-in Customer"}</div>
                      <div className="text-xs text-gray-500">{inv.customerPhone || "N/A"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-bold border-none">
                          {inv.items.length}
                        </Badge>
                        <span className="text-xs text-gray-400">Items</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal capitalize bg-white">
                        {inv.paymentMode}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-gray-900">
                      {formatINR(inv.total)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild className="text-gray-500 hover:text-blue-600">
                          <Link href={`/invoices/${inv.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild className="text-gray-500 hover:text-blue-600">
                          <Link href={`/invoices/${inv.id}?print=true`}>
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Receipt className="h-12 w-12 text-gray-200 mb-4" />
                      <p className="text-lg font-medium">No invoices found</p>
                      <p className="text-sm">Try a different search or create a new invoice.</p>
                      <Button asChild variant="outline" className="mt-6">
                        <Link href="/invoice/new">Create First Invoice</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
