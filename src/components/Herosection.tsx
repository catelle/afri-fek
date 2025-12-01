"use client"

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Play, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DotPattern } from './dot-pattern'
import { useLandingData } from '@/hooks/useLandingData'
import { useState, useEffect } from 'react'
import { HeroSearchBar } from './HeroSearchBar'


interface HerosectionProps {
  onNavigateToJournals?: () => void;
  onSearchSelect?: (searchTerm: string) => void;
}
export const Herosection = ({ onNavigateToJournals, onSearchSelect }: HerosectionProps) => {
  const { images, landingContent } = useLandingData();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);
    
  return (
    <section className="relative mt-[50px] overflow-hidden bg-gradient-to-b from-background to-background/80  pb-16">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        {/* Dot pattern overlay using reusable component */}
        <DotPattern className="opacity-100" size="md" fadeStyle="ellipse" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mx-auto max-w-7xl text-center">
        

          {/* Main Headline */}
          <h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            {landingContent.heroTitle}
          </h1>

          {/* Subheading */}
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {landingContent.heroSubtitle}
          </p>

          {/* Search Bar */}
          {onSearchSelect && (
            <HeroSearchBar onSearchSelect={onSearchSelect} />
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="text-base cursor-pointer" onClick={onNavigateToJournals}>
              Explorer les resources
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="text-base cursor-pointer" asChild>
              <a href="#">
                <Play className="mr-2 h-4 w-4" />
                Resources Scopus
              </a>
            </Button>
          </div>
        </div>

        {/* Hero Image/Visual */}
        <div className="mx-auto mt-20 max-w-6xl">
          <div className="relative group">
            {/* Top background glow effect - positioned above the image */}
            <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-10 lg:h-80 bg-primary/50 rounded-full blur-2xl"></div>

            <div className="relative rounded-xl border bg-card shadow-2xl overflow-hidden">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                {images.map((image, index) => (
                 <Image
  key={index}
  src={image}
  alt={`Hero Image ${index + 1}`}
  width={400}
  height={300}
  className="w-full h-90 flex-shrink-0 rounded-xl object-cover"  // ← change height here
  priority={index === 0}
/>

                  
                ))}
              </div>

              {/* Bottom fade effect - gradient overlay that fades the image to background */}
              <div className="absolute bottom-0 left-0 w-full h-32 md:h-40 lg:h-48 bg-gradient-to-b from-transparent via-black/50 to-black/70 rounded-b-xl"></div>

              {/* Overlay play button for demo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="lg"
                  className="rounded-full h-16 w-16 p-0 cursor-pointer hover:scale-105 transition-transform"
                  asChild
                >
                  <a href="#" aria-label="Watch demo video">
                    <Play className="h-6 w-6 fill-current" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
