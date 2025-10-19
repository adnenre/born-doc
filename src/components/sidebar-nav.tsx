"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import type { NavItem } from "@/lib/types"
import { cn } from "@/lib/utils"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/ui/sidebar"
import * as React from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { ChevronRight } from "lucide-react"

interface SidebarNavProps {
  items: NavItem[]
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname()

  if (!items?.length) {
    return null
  }

  return (
    <SidebarMenu>
      {items.map((item, index) => (
        <SidebarNavItem key={index} item={item} pathname={pathname} />
      ))}
    </SidebarMenu>
  )
}

function SidebarNavItem({ item, pathname }: { item: NavItem, pathname: string }) {
  const isActive = pathname === item.slug
  const hasChildren = item.children && item.children.length > 0
  
  const [isOpen, setIsOpen] = React.useState(item.slug ? pathname.startsWith(item.slug) : false);

  React.useEffect(() => {
    if (item.slug && pathname.startsWith(item.slug)) {
      setIsOpen(true);
    }
  }, [pathname, item.slug]);


  if (hasChildren) {
    return (
      <SidebarMenuItem>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <button
                className="flex w-full items-center justify-between rounded-md p-2 text-sm font-medium text-left hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              {item.title}
              <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children!.map((child, index) => (
                <SidebarMenuSubItem key={index}>
                  <Link href={child.slug}>
                    <SidebarMenuSubButton isActive={pathname === child.slug}>
                      {child.title}
                    </SidebarMenuSubButton>
                  </Link>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <Link href={item.slug}>
        <SidebarMenuButton isActive={isActive}>{item.title}</SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  )
}
