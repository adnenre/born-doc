import Link from "next/link";
import { Palette } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Search } from "@/components/search";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Palette className="h-6 w-6 text-primary" />
            <span className="font-bold">Born Docs</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="flex-1 sm:flex-grow-0">
            <Search />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
