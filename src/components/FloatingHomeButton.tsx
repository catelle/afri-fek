'use client';

import { Home } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function FloatingHomeButton() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Don't show on home page
  if (pathname === '/') return null;
  
  const handleHomeClick = () => {
    router.push('/');
  };
  
  return (
    <button
      onClick={handleHomeClick}
      className="fixed bottom-24 right-6 z-[9999] bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-white"
      aria-label="Retour à l'accueil"
      style={{ position: 'fixed', bottom: '96px', right: '24px', zIndex: 9999 }}
    >
      <Home className="w-6 h-6" />
    </button>
  );
}