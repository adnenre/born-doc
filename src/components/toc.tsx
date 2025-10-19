"use client"

import * as React from "react"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { cn } from "@/lib/utils"
import type { TocEntry } from "@/lib/types"

interface TocProps {
  toc: TocEntry[]
}

export function Toc({ toc }: TocProps) {
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const itemIds = React.useMemo(() => toc.map((item) => item.slug), [toc])

  useIntersectionObserver(itemIds, setActiveId)

  if (!toc.length) {
    return null
  }

  return (
    <div className="space-y-2">
      <p className="font-medium">On This Page</p>
      <ul className="space-y-2">
        {toc.map((item) => (
          <li key={item.slug}>
            <a
              href={`#${item.slug}`}
              className={cn(
                "block text-sm text-muted-foreground transition-colors hover:text-foreground",
                {
                  "text-foreground font-medium": activeId === item.slug,
                },
                item.level > 2 ? "pl-4" : ""
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
