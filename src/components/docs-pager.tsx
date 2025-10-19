import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import type { NavItem } from "@/lib/types"

interface DocsPagerProps {
  prev: NavItem | null
  next: NavItem | null
}

export function DocsPager({ prev, next }: DocsPagerProps) {
  return (
    <div className="flex flex-row items-center justify-between">
      {prev ? (
        <Link
          href={prev.slug}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <span className="mr-2">←</span>
          {prev.title}
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.slug}
          className={cn(buttonVariants({ variant: "outline" }), "ml-auto")}
        >
          {next.title}
          <span className="ml-2">→</span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  )
}
