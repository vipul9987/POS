"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  BarChart3, 
  Package, 
  PlusCircle, 
  FileText, 
  LogOut, 
  Receipt,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getUser, clearUser } from '@/lib/storage';
import { getDaysLeft } from '@/lib/utils';
import { User } from '@/types';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUserData] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const data = getUser();
    if (!data) {
      router.push('/login');
    } else {
      setUserData(data);
      setIsLoaded(true);
    }
  }, [router]);

  const handleSignOut = () => {
    clearUser();
    router.push('/');
  };

  if (!isLoaded || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Receipt className="h-12 w-12 text-blue-600 animate-bounce" />
          <p className="text-lg font-medium text-gray-500">Loading QuickBill...</p>
        </div>
      </div>
    );
  }

  const daysLeft = getDaysLeft(user.trialEnds);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Inventory', href: '/inventory', icon: Package },
    { name: 'New Invoice', href: '/invoice/new', icon: PlusCircle },
    { name: 'Invoices', href: '/invoices', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden no-print">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col shrink-0">
        <div className="h-16 border-b flex items-center px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Receipt className="h-7 w-7 text-blue-600" />
            <span className="text-xl font-bold font-sans tracking-tight">QuickBill</span>
          </Link>
        </div>

        <div className="flex-1 py-6 px-4 space-y-1">
          <div className="mb-4 px-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Business</p>
            <p className="text-sm font-bold truncate text-gray-900">{user.business}</p>
          </div>
          
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-blue-50 text-blue-700" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t space-y-4">
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-orange-800 uppercase tracking-widest">{user.plan} Trial</span>
              <Badge variant="outline" className="text-[10px] bg-white text-orange-700 border-orange-200">
                {daysLeft} days left
              </Badge>
            </div>
            {daysLeft < 5 && (
              <p className="text-[10px] text-orange-700 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Renew soon to avoid interruption
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-900 truncate max-w-[120px]">{user.name}</span>
              <span className="text-[10px] text-gray-500 truncate max-w-[120px]">{user.email}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-gray-500 hover:text-red-600">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50/50">
        {children}
      </main>
    </div>
  );
}
