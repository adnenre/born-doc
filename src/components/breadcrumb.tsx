"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import React from "react"

export function Breadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  function toTitleCase(str: string) {
    return str.replace(/-/g, " ").replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  if (segments.length === 0) {
    return null
  }

  if (segments.length <= 1) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex items-center space-x-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-4 w-4" />
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`
        const isLast = index === segments.length - 1

        return (
          <React.Fragment key={href}>
            <Link
              href={href}
              className={cn(
                "hover:text-foreground",
                isLast && "text-foreground font-medium"
              )}
            >
              {toTitleCase(segment)}
            </Link>
            {!isLast && <ChevronRight className="h-4 w-4" />}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
