"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2 } from 'lucide-react';
import { setUser, getUser } from '@/lib/storage';
import { User } from '@/types';
import { toast } from 'sonner';

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get('plan') || 'Professional';
  
  const [formData, setFormData] = useState({
    business: '',
    name: '',
    email: '',
    phone: '',
    gstin: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    const user = getUser();
    if (user) {
      router.replace('/dashboard');
    }
  }, [router]);

  const planPrices = {
    'Starter': 499,
    'Professional': 1299,
    'Enterprise': 3499,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validation
      if (!formData.business || !formData.name || !formData.email || !formData.phone) {
        toast.error("Please fill all required fields");
        setIsLoading(false);
        return;
      }

      if (formData.phone.length !== 10) {
        toast.error("Phone number must be 10 digits");
        setIsLoading(false);
        return;
      }

      if (formData.gstin && formData.gstin.length !== 15) {
        toast.error("GSTIN must be 15 characters");
        setIsLoading(false);
        return;
      }

      const trialEnds = new Date();
      trialEnds.setDate(trialEnds.getDate() + 14);

      const user: User = {
        ...formData,
        plan: selectedPlan as any,
        planPrice: planPrices[selectedPlan as keyof typeof planPrices] || 1299,
        trialEnds: trialEnds.toISOString(),
      };

      setUser(user);
      toast.success("Account created successfully!");
      
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Plan Selected</p>
              <p className="text-sm font-bold text-blue-900">{selectedPlan}</p>
            </div>
          </div>
          <p className="text-sm font-bold text-blue-900">₹{planPrices[selectedPlan as keyof typeof planPrices]}/mo</p>
        </div>
        <CardTitle className="text-2xl text-center">Create Your Account</CardTitle>
        <CardDescription className="text-center">
          Start your 14-day free trial. No credit card required.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business">Business Name</Label>
            <Input 
              id="business" 
              placeholder="Dutta Enterprises" 
              required 
              value={formData.business}
              onChange={(e) => setFormData({...formData, business: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Contact Person Name</Label>
            <Input 
              id="name" 
              placeholder="Rajesh Dutta" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="rajesh@dutta.com" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (10 Digits)</Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="9876543210" 
                maxLength={10}
                required 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gstin">GSTIN (Optional)</Label>
            <Input 
              id="gstin" 
              placeholder="27AAAAA0000A1Z5" 
              maxLength={15}
              value={formData.gstin}
              onChange={(e) => setFormData({...formData, gstin: e.target.value.toUpperCase()})}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
            {isLoading ? "Creating Account..." : "Start Free Trial"}
          </Button>
          <p className="text-xs text-center text-gray-500">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
          <div className="text-sm text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
