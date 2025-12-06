import { NavigationMenuContent } from "@/components/ui/navigation-menu"
import { BookOpen, Building2, FileText, GraduationCap, HelpCircle, LifeBuoy, Rss, User } from "lucide-react"
import { JSX } from "react"

export const getMenuIcon = (type: string) => {
  const commonClasses = "h-[50px] w-[50px] text-[#84cc16]"

  const map: Record<string, JSX.Element> = {
    journal: <BookOpen className={commonClasses} />,
    institution: <Building2 className={commonClasses} />,
    blog: <Rss className={commonClasses} />,
    academy: <GraduationCap className={commonClasses} />,
    article: <FileText className={commonClasses} />,
    support: <LifeBuoy className={commonClasses} />,
    contact: <User className={commonClasses} />,
    howtouse: <HelpCircle className={commonClasses} />,
  }

  return map[type] || <BookOpen className={commonClasses} />
}

export default function MegaMenu({ sections, onSelect }: any) {
  return (
   <NavigationMenuContent className="left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto"> 
   <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[400px]">
      {sections.map((section: any, idx: number) => (
        <div key={idx}>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            {section.title}
          </h4>
          <div className=" grid grid-cols-2 gap-2">
            {section.items.map((item: any) => (
              <button
                key={item.label}
                onClick={() => onSelect(item)}
                className="flex items-start gap-4 p-4 rounded-lg
                  transition-all duration-200
                  hover:bg-amber-50 hover:shadow-md
                  focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {item.filter && getMenuIcon(item.filter)}
                <div>
                  <div className="text-base font-medium text-[#84cc16]">{item.label}</div>
                  <p className="text-base text-gray-500 line-clamp-2">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
      </div>
    </NavigationMenuContent>
  )
}
