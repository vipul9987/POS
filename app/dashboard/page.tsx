"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Package, 
  Receipt, 
  PlusCircle, 
  Eye, 
  ArrowRight,
  FileText,
  IndianRupee,
  ShoppingBag,
  TrendingUp,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getInvoices, getProducts } from '@/lib/storage';
import { formatINR } from '@/lib/utils';
import { Invoice, Product } from '@/types';

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setInvoices(getInvoices());
    setProducts(getProducts());
  }, []);

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const today = new Date().toISOString().split('T')[0];
  const todayRevenue = invoices
    .filter(inv => inv.date.startsWith(today))
    .reduce((sum, inv) => sum + inv.total, 0);
  
  const recentInvoices = invoices.slice(0, 5);
  const productsInStock = products.reduce((sum, p) => sum + p.stock, 0);

  const stats = [
    {
      title: "Today's Revenue",
      value: formatINR(todayRevenue),
      icon: <TrendingUp className="h-5 w-5 text-green-600" />,
      description: "Sales for today",
      color: "bg-green-50"
    },
    {
      title: "Total Revenue",
      value: formatINR(totalRevenue),
      icon: <IndianRupee className="h-5 w-5 text-blue-600" />,
      description: "Lifetime earnings",
      color: "bg-blue-50"
    },
    {
      title: "Invoices Created",
      value: invoices.length,
      icon: <Receipt className="h-5 w-5 text-purple-600" />,
      description: "Total orders processed",
      color: "bg-purple-50"
    },
    {
      title: "Products in Stock",
      value: productsInStock,
      icon: <ShoppingBag className="h-5 w-5 text-orange-600" />,
      description: "Across all categories",
      color: "bg-orange-50"
    }
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/invoice/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Invoice
          </Link>
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Recent Invoices */}
        <Card className="md:col-span-4 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-1">
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>
                You've created {invoices.length} invoices in total.
              </CardDescription>
            </div>
            <Button asChild size="sm" variant="outline" className="ml-auto">
              <Link href="/invoices">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentInvoices.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.number}</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{invoice.customerName || "Walk-in Customer"}</div>
                        <div className="text-xs text-gray-500">{invoice.customerPhone || "-"}</div>
                      </TableCell>
                      <TableCell>{formatINR(invoice.total)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/invoices/${invoice.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl border-gray-100">
                <Receipt className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No invoices yet</h3>
                <p className="text-sm text-gray-500 max-w-[250px] mt-2 mb-6">
                  Start by creating your first GST-compliant invoice.
                </p>
                <Button asChild variant="outline">
                  <Link href="/invoice/new">Create First Invoice</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="md:col-span-3 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your business operations</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/invoice/new" className="group p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-600 transition-all flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-50 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <PlusCircle className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">Create New Invoice</p>
                <p className="text-xs text-gray-500 italic">Bill your customers in seconds</p>
              </div>
            </Link>

            <Link href="/inventory" className="group p-4 bg-white border border-gray-200 rounded-xl hover:border-orange-600 transition-all flex items-center gap-4">
              <div className="p-3 rounded-lg bg-orange-50 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Package className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">Manage Inventory</p>
                <p className="text-xs text-gray-500 italic">Add products or check stock</p>
              </div>
            </Link>

            <Link href="/invoices" className="group p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-600 transition-all flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-50 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">View Invoices</p>
                <p className="text-xs text-gray-500 italic">Search and print old bills</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
