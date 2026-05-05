import { Suspense } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Receipt } from 'lucide-react';
import SignupForm from '@/components/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <Receipt className="h-8 w-8 text-blue-600" />
        <span className="text-2xl font-bold">QuickBill</span>
      </Link>

      <Suspense fallback={
        <Card className="w-full max-w-md p-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </Card>
      }>
        <SignupForm />
      </Suspense>
    </div>
  );
}
