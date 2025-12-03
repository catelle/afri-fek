"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, Mail } from "lucide-react"
import LanguageDropdown from "./LanguageDropdown"
import MegaMenu from "./MegaMenu"


// ---------------------------
// Navbar Data
// ---------------------------
const resourcesMenu = [
  {
    title: "Découvrir les Ressources",
    items: [
      { label: "Journaux", description: "Explorer les journaux académiques et publications scientifiques.", filter: "Journal" },
      { label: "Institutions", description: "Parcourir les universités et centres de recherche africains.", filter: "institution" },
      { label: "Blogs", description: "Trouver des commentaires d'experts et contenu créatif.", filter: "blog" },
      { label: "Universités", description: "Académies éducatives, centres de formation et plateformes e-learning.", filter: "university" },
      { label: "Articles", description: "Articles de recherche tendance et résumés scientifiques.", filter: "article" },
      { label: "Ouvrages", description: "Ouvrages de recherche tendance et résumés scientifiques.", filter: "ouvrage" },

    ],
  },
]

const howToMenu = [
  {
    title: "Guides & Tutoriels",
    items: [
      { label: "Commencer", description: "Guide de démarrage rapide pour utiliser notre plateforme.", href: "#howto-start" },
      { label: "Tutoriel Vidéo", description: "Regarder des vidéos étape par étape.", href: "#howto-video" },
      { label: "FAQ", description: "Questions Fréquemment Posées.", href: "#faq" },
    ],
  },
]

const journauxMenu = [
  {
    title: "Catégories de Journaux",
    items: [
      { label: "Journaux Scientifiques", description: "Journaux de recherche et sciences.", href: "#journaux-science" },
      { label: "Journaux Académiques", description: "Journaux éducatifs et académiques.", href: "#journaux-academic" },
      { label: "Journaux d'Actualités", description: "Événements actuels et publications d'actualités.", href: "#journaux-news" },
    ],
  },
]

const supportMenu = [
  {
    title: "Support",
    items: [
      { label: "Signaler un Problème", description: "Soumettre un bug ou un problème.", href: "#support-report" },
      { label: "Demander de l'Aide", description: "Contacter l'équipe de support.", href: "#support-help" },
      { label: "Documentation", description: "Guides et documentation de la plateforme.", href: "#support-docs" },
    ],
  },
]

// ---------------------------
// Navbar Component
// ---------------------------
interface NavbarProps {
  setActiveView: (v: string) => void
  setResourceFilter: (v: string) => void
  onContactClick: () => void
  language: "fr" | "en"
  setLanguage: (l: "fr" | "en") => void
  setShowSubmit: (show: boolean) => void
}

export default function AfriNavbar({ setActiveView, setResourceFilter, onContactClick, language, setLanguage, setShowSubmit }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 25)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleResourceSelect = (item: any) => {
    if (item.filter) setResourceFilter(item.filter)
    setActiveView("resources")
    setMobileOpen(false)
    // Close navigation menu
    document.body.click()
  }

  const handleLinkClick = (href: string | any) => {
    const hrefStr = typeof href === 'string' ? href : href?.href || ''
    if (hrefStr.startsWith("#")) {
      const el = document.querySelector(hrefStr)
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    setMobileOpen(false)
    // Close navigation menu
    document.body.click()
  }

  return (
    <header className={`sticky top-0 z-50 border-b transition-all ${scrolled ? "bg-amber-600 text-white shadow-sm" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo-afri-removebg-preview.png" className="h-8 w-8" />
          <span className="font-bold text-xl text-amber-600">Afri-Fek</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden xl:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink className="px-4 py-2 text-base font-medium  cursor-pointer hover:text-amber-600" onClick={() => setActiveView("home")}>
                Accueil
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-base font-medium px-4 py-2 hover:text-amber-600">Ressources</NavigationMenuTrigger>
              <MegaMenu sections={resourcesMenu} onSelect={handleResourceSelect} />
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-base font-medium px-4 py-2 hover:text-amber-600">Comment Utiliser</NavigationMenuTrigger>
              <MegaMenu sections={howToMenu} onSelect={handleLinkClick} />
            </NavigationMenuItem>

            {/* <NavigationMenuItem>
              <NavigationMenuTrigger className="text-base font-medium px-4 py-2 hover:text-amber-600">Journaux</NavigationMenuTrigger>
              <MegaMenu sections={journauxMenu} onSelect={handleLinkClick} />
            </NavigationMenuItem> */}

            <NavigationMenuItem>
              <NavigationMenuTrigger className="px-4 font-medium text-base y-2 hover:text-amber-600">Assistance</NavigationMenuTrigger>
              <MegaMenu sections={supportMenu} onSelect={handleLinkClick} />
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink className="px-4 font-medium py-2 text-base cursor-pointer hover:text-amber-600" onClick={() => setShowSubmit(true)}>
                Soumettre une Ressource
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Section */}
        <div className="hidden xl:flex items-center gap-4">
          <LanguageDropdown currentLanguage={language} onLanguageChange={setLanguage} />
          <Button onClick={onContactClick} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white">
            <Mail className="h-4 w-4" /> Contact
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="xl:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-72 sm:w-80 p-4">
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Afri-Fek</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Mobile Links */}
              <div className="flex flex-col gap-4 text-gray-700">
                <button onClick={() => { setActiveView("home"); setMobileOpen(false); }} className="py-1">Accueil</button>

                <p className="font-semibold">Ressources</p>
                {resourcesMenu[0].items.map((item) => (
                  <button key={item.label} className="block py-1 pl-3" onClick={() => handleResourceSelect(item)}>{item.label}</button>
                ))}

                <p className="font-semibold">Comment Utiliser</p>
                {howToMenu[0].items.map((item) => (
                  <button key={item.label} className="block py-1 pl-3" onClick={() => handleLinkClick(item.href)}>{item.label}</button>
                ))}

                <p className="font-semibold">Journaux</p>
                {journauxMenu[0].items.map((item) => (
                  <button key={item.label} className="block py-1 pl-3" onClick={() => handleLinkClick(item.href)}>{item.label}</button>
                ))}

                <p className="font-semibold">Support</p>
                {supportMenu[0].items.map((item) => (
                  <button key={item.label} className="block py-1 pl-3" onClick={() => handleLinkClick(item.href)}>{item.label}</button>
                ))}

                <button onClick={() => { setShowSubmit(true); setMobileOpen(false); }} className="py-1 text-left">Soumettre Ressource</button>

                <Button onClick={onContactClick} className="mt-4 bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Contact
                </Button>

                <LanguageDropdown currentLanguage={language} onLanguageChange={setLanguage} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
