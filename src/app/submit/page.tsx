import ResourceForm from '@/components/ResourceForm';
import { Suspense } from 'react';

export default function ResourceDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        
      
    </Suspense>
  );
}