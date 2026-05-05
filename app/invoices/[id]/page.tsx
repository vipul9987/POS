import { Suspense } from 'react';
import InvoiceDetails from '@/components/InvoiceDetails';

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <InvoiceDetails id={params.id} />
    </Suspense>
  );
}
