import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  url: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`} aria-label="Breadcrumb">
      <Link 
        href="/" 
        className="flex items-center hover:text-amber-600 transition-colors"
        aria-label="Accueil"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={item.url} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          
          {item.current ? (
            <span className="font-medium text-gray-900" aria-current="page">
              {item.name}
            </span>
          ) : (
            <Link 
              href={item.url}
              className="hover:text-amber-600 transition-colors"
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}

// Helper function to generate breadcrumbs based on pathname
export function generateBreadcrumbs(pathname: string, resourceName?: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  
  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    let name = segment;
    
    // Customize names based on segments
    switch (segment) {
      case 'resources':
        name = 'Ressources';
        break;
      case 'journals':
        name = 'Journaux';
        break;
      case 'articles':
        name = 'Articles';
        break;
      case 'institutions':
        name = 'Institutions';
        break;
      case 'submit':
        name = 'Soumettre';
        break;
      case 'admin':
        name = 'Administration';
        break;
      default:
        // For dynamic segments, use the resource name if available
        if (isLast && resourceName) {
          name = resourceName;
        } else {
          // Capitalize and replace hyphens
          name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
        }
    }
    
    breadcrumbs.push({
      name,
      url: currentPath,
      current: isLast
    });
  });
  
  return breadcrumbs;
}