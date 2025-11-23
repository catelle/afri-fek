'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function ResourceDetailRedirect() {
  const params = useParams();

  useEffect(() => {
    const resourceId = params?.id as string;
    if (resourceId) {
      // Redirect to main page with resource parameter
      window.location.href = `/?resource=${resourceId}`;
    }
  }, [params?.id]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray-500">Redirecting...</p>
    </div>
  );
}