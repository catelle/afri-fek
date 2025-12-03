import ResourceDetailContent from '@/components/ResourceDetailContent';
import { Suspense } from 'react';

export default async function ResourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResourceDetailContent resourceId={id} />
    </Suspense>
  );
}