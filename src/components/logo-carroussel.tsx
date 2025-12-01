"use client"

import { Card } from "@/components/ui/card"

// Component to load images from /public
const LogoImage = ({ src, size = 32 }: { src: string; size?: number }) => {
  return (
    <img
      src={src} 
      alt={src}
      width={size}
      height={size}
      className="object-contain"
    />
  )
}

// Your real logo list
const logos = [
  { name: "MINRESI", src: "/logo-minresi.png" },
  { name: "CAMES", src: "/logo-cames.png" },
  { name: "MINSANTE", src: "/logo-minsante.png" },
  { name: "MINRESI", src: "/logo-minresi.png" },
  { name: "CAMES", src: "/logo-cames.png" },
  { name: "MINSANTE", src: "/logo-minsante.png" },
] as const

export function LogoCarousel() {
  return (
    <section className="pb-12 sm:pb-16 lg:pb-20 pt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground mb-8">
            Trusted by leading institutions
          </p>

          <div className="relative">
            {/* Left Fade */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

            {/* Right Fade */}
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <div className="overflow-hidden">
              <div className="flex animate-logo-scroll space-x-8 sm:space-x-12">

                {/* First scrolling set */}
                {logos.map((logo, index) => (
                  <Card
                    key={`first-${index}`}
                    className="flex-shrink-0 flex items-center justify-center h-16 w-40 opacity-60 hover:opacity-100 transition-opacity duration-300 border-0 shadow-none bg-transparent"
                  >
                    <div className="flex items-center gap-3">
                      <LogoImage src={logo.src} size={36} />
                      <span className="text-foreground text-lg font-semibold whitespace-nowrap">
                        {logo.name}
                      </span>
                    </div>
                  </Card>
                ))}

                {/* Duplicate set for infinite loop */}
                {logos.map((logo, index) => (
                  <Card
                    key={`second-${index}`}
                    className="flex-shrink-0 flex items-center justify-center h-16 w-40 opacity-60 hover:opacity-100 transition-opacity duration-300 border-0 shadow-none bg-transparent"
                  >
                    <div className="flex items-center gap-4">
                      <LogoImage src={logo.src} size={36} />
                      <span className="text-foreground text-lg font-semibold whitespace-nowrap">
                        {logo.name}
                      </span>
                    </div>
                  </Card>
                ))}

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
