# 🚀 Afri-Fek Refactoring Plan

## 📁 **NEW FOLDER STRUCTURE**

```
src/
├── app/                          # Next.js App Router
│   ├── (main)/                   # Route group for main site
│   │   ├── page.tsx              # Homepage (/)
│   │   ├── layout.tsx            # Main layout
│   │   └── loading.tsx           # Loading UI
│   ├── resources/                # Resources section (/resources)
│   │   ├── page.tsx              # Resources overview
│   │   ├── layout.tsx            # Resources layout
│   │   ├── journals/             # Journals (/resources/journals)
│   │   │   ├── page.tsx
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx      # Individual journal
│   │   │   └── loading.tsx
│   │   ├── articles/             # Articles (/resources/articles)
│   │   │   ├── page.tsx
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx
│   │   │   └── loading.tsx
│   │   └── institutions/         # Institutions (/resources/institutions)
│   │       ├── page.tsx
│   │       ├── [slug]/
│   │       │   └── page.tsx
│   │       └── loading.tsx
│   ├── submit/                   # Submission pages
│   │   ├── page.tsx              # Submit form
│   │   └── success/
│   │       └── page.tsx          # Success page
│   ├── admin/                    # Admin section
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── dashboard/
│   │       └── page.tsx
│   ├── api/                      # API routes
│   │   ├── resources/
│   │   ├── submit/
│   │   └── admin/
│   ├── sitemap.xml/              # Dynamic sitemap
│   │   └── route.ts
│   ├── robots.txt/               # Robots.txt
│   │   └── route.ts
│   ├── globals.css
│   ├── layout.tsx                # Root layout
│   ├── loading.tsx               # Global loading
│   ├── not-found.tsx             # 404 page
│   └── error.tsx                 # Error boundary
├── components/                   # Reusable components
│   ├── ui/                       # Base UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   ├── card.tsx
│   │   └── index.ts              # Barrel exports
│   ├── layout/                   # Layout components
│   │   ├── header/
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── LanguageSelector.tsx
│   │   ├── footer/
│   │   │   ├── Footer.tsx
│   │   │   └── FooterLinks.tsx
│   │   └── sidebar/
│   │       └── Sidebar.tsx
│   ├── features/                 # Feature-specific components
│   │   ├── resources/
│   │   │   ├── ResourceCard.tsx
│   │   │   ├── ResourceList.tsx
│   │   │   ├── ResourceFilter.tsx
│   │   │   └── ResourceSearch.tsx
│   │   ├── submission/
│   │   │   ├── SubmissionForm.tsx
│   │   │   ├── FormSteps.tsx
│   │   │   └── FileUpload.tsx
│   │   ├── admin/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ResourceTable.tsx
│   │   │   └── Statistics.tsx
│   │   └── landing/
│   │       ├── HeroSection.tsx
│   │       ├── VisionSection.tsx
│   │       ├── StatsSection.tsx
│   │       └── TestimonialsSection.tsx
│   ├── common/                   # Common components
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── SEOHead.tsx
│   │   └── Breadcrumbs.tsx
│   └── providers/                # Context providers
│       ├── LanguageProvider.tsx
│       ├── ThemeProvider.tsx
│       └── QueryProvider.tsx
├── lib/                          # Utilities and configurations
│   ├── services/                 # API services
│   │   ├── firebase/
│   │   │   ├── config.ts
│   │   │   ├── resources.ts
│   │   │   └── auth.ts
│   │   ├── supabase/
│   │   │   ├── config.ts
│   │   │   └── storage.ts
│   │   └── translation/
│   │       ├── config.ts
│   │       └── ai-translation.ts
│   ├── hooks/                    # Custom hooks
│   │   ├── useResources.ts
│   │   ├── useTranslation.ts
│   │   ├── useLocalStorage.ts
│   │   └── useDebounce.ts
│   ├── utils/                    # Utility functions
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   ├── seo.ts
│   │   └── constants.ts
│   ├── types/                    # TypeScript types
│   │   ├── resource.ts
│   │   ├── user.ts
│   │   └── api.ts
│   └── config/                   # Configuration files
│       ├── database.ts
│       ├── seo.ts
│       └── routes.ts
├── styles/                       # Styling
│   ├── globals.css
│   ├── components.css
│   └── utilities.css
└── data/                         # Static data
    ├── translations/
    │   ├── fr.json
    │   └── en.json
    └── seo/
        ├── metadata.ts
        └── structured-data.ts
```

## 🔧 **REFACTORING STRATEGY**

### Phase 1: Core Structure Setup
1. Create new folder structure
2. Move existing components to appropriate folders
3. Set up barrel exports for clean imports

### Phase 2: Component Modularization
1. Break down large components (page.tsx is 800+ lines!)
2. Create reusable UI components
3. Implement proper TypeScript interfaces

### Phase 3: Service Layer
1. Extract API calls into service functions
2. Create custom hooks for data fetching
3. Implement proper error handling

### Phase 4: SEO Implementation
1. Set up proper routing structure
2. Implement metadata and structured data
3. Create sitemaps and robots.txt

## 📊 **SEO-FRIENDLY ROUTING STRUCTURE**

```
/                           # Homepage (Landing)
├── /resources              # Resources overview
│   ├── /journals          # All journals
│   │   └── /[slug]        # Individual journal
│   ├── /articles          # All articles  
│   │   └── /[slug]        # Individual article
│   └── /institutions      # All institutions
│       └── /[slug]        # Individual institution
├── /submit                # Submission form
├── /about                 # About page
├── /contact               # Contact page
└── /admin                 # Admin dashboard
```

## 🎯 **KEY IMPROVEMENTS**

### Code Quality
- ✅ Modular components (max 200 lines each)
- ✅ Custom hooks for data fetching
- ✅ Proper TypeScript interfaces
- ✅ Consistent error handling
- ✅ Clean import/export structure

### Performance
- ✅ Code splitting by route
- ✅ Lazy loading components
- ✅ Optimized images
- ✅ Caching strategies

### SEO Optimization
- ✅ Semantic URL structure
- ✅ Proper meta tags per page
- ✅ Structured data (JSON-LD)
- ✅ Breadcrumb navigation
- ✅ Internal linking strategy
- ✅ Dynamic sitemaps

### Maintainability
- ✅ Feature-based organization
- ✅ Reusable components
- ✅ Centralized configuration
- ✅ Consistent naming conventions

## 🚀 **IMPLEMENTATION PLAN**

### Week 1: Foundation
- [ ] Set up new folder structure
- [ ] Create base UI components
- [ ] Implement TypeScript interfaces

### Week 2: Component Refactoring
- [ ] Break down large components
- [ ] Create feature-specific components
- [ ] Implement custom hooks

### Week 3: Service Layer
- [ ] Extract API services
- [ ] Implement error handling
- [ ] Add loading states

### Week 4: SEO & Polish
- [ ] Implement SEO metadata
- [ ] Add structured data
- [ ] Create sitemaps
- [ ] Performance optimization

## 📈 **EXPECTED BENEFITS**

### Developer Experience
- 🔍 Easier to find and modify code
- 🧪 Better testability
- 🔄 Faster development cycles
- 📚 Better code documentation

### SEO Performance
- 🎯 Better Google indexing
- 🔗 Improved sitelinks generation
- 📊 Enhanced search visibility
- 🚀 Better Core Web Vitals

### User Experience
- ⚡ Faster page loads
- 📱 Better mobile experience
- 🌐 Improved accessibility
- 🔄 Smoother navigation