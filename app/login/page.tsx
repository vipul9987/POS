"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Receipt, Store } from 'lucide-react';
import { getUser, setUser } from '@/lib/storage';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [existingUser, setExistingUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setExistingUser(getUser());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!existingUser) {
      // Create demo user if none exists
      const trialEnds = new Date();
      trialEnds.setDate(trialEnds.getDate() + 14);
      const demoUser = {
        business: "Demo Store",
        name: "Demo User",
        email: email || "demo@quickbill.com",
        phone: "9876543210",
        plan: "Professional" as const,
        planPrice: 1299,
        trialEnds: trialEnds.toISOString(),
      };
      setUser(demoUser);
      toast.success("Welcome to Demo Store!");
    } else {
      toast.success(`Welcome back, ${existingUser.business}!`);
    }
    
    router.push('/dashboard');
  };

  const handleContinueAs = () => {
    toast.success(`Continuing as ${existingUser.business}`);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <Receipt className="h-8 w-8 text-blue-600" />
        <span className="text-2xl font-bold">QuickBill</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Sign in to manage your business
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {existingUser ? (
            <div className="space-y-4">
              <Button 
                onClick={handleContinueAs}
                className="w-full flex items-center justify-center gap-2 h-16 text-lg"
              >
                <Store className="h-6 w-6" />
                Continue as {existingUser.business}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground font-medium">Or log in as different user</span>
                </div>
              </div>
            </div>
          ) : null}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@business.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              {existingUser ? "Switch Identity" : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full text-gray-500">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up today
            </Link>
          </p>
        </CardFooter>
      </Card>
      
      <div className="mt-8 text-center max-w-sm">
        <p className="text-xs text-gray-400 italic">
          Demo Tip: For this demo, any email and password will work. If no account is found, a demo store will be created automatically.
        </p>
      </div>
    </div>
  );
}
