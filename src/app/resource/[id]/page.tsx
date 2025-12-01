import ResourceDetailContent from '@/components/ResourceDetailContent';
import { Suspense } from 'react';

export default function ResourceDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResourceDetailContent resourceId={params.id} />
    </Suspense>
  );
}