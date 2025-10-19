"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import FlexSearch from "flexsearch"

interface SearchResult {
  slug: string
  title: string
  content: string
}

type EnrichedSearchResult = FlexSearch.EnrichedDocument<SearchResult, true>;

export function Search() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<EnrichedSearchResult[]>([])
  const [index, setIndex] = React.useState<FlexSearch.Document<SearchResult, true> | null>(null)
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  React.useEffect(() => {
    const searchIndex = new FlexSearch.Document<SearchResult, true>({
      document: {
        id: "slug",
        index: ["title", "content"],
        store: true,
      },
      tokenize: "forward",
    });

    fetch(`/search-index.json`)
      .then((res) => res.json())
      .then((data: SearchResult[]) => {
        data.forEach(item => searchIndex.add(item));
        setIndex(searchIndex);
      });
  }, []);

  React.useEffect(() => {
    if (query && index) {
      const searchResults = index.search(query, { enrich: true, limit: 10 });
      
      const uniqueResults = new Map<string, EnrichedSearchResult>();
      
      searchResults.forEach(resultSet => {
        resultSet.result.forEach(result => {
          if (!uniqueResults.has(result.doc.slug)) {
            uniqueResults.set(result.doc.slug, result);
          }
        });
      });

      setResults(Array.from(uniqueResults.values()));
      setSelectedIndex(0);
    } else {
      setResults([])
    }
  }, [query, index])
  
  React.useEffect(() => {
    if (!open) {
      setQuery("")
    }
  }, [open])

  const handleSelect = (slug: string) => {
    if (!slug) return
    router.push(slug)
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault()
      handleSelect(results[selectedIndex].doc.slug)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search documentation...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 top-1/4">
          <div className="flex items-center border-b px-3">
            <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command or search..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="p-2">
            {results.length > 0 ? (
              <div className="space-y-1">
                {results.map((result, i) => (
                  <div
                    key={result.id as string}
                    onClick={() => handleSelect(result.doc.slug)}
                    className={cn(
                      "cursor-pointer rounded-sm p-2",
                      selectedIndex === i ? "bg-accent" : "hover:bg-accent/50"
                    )}
                  >
                    <p className="font-medium">{result.doc.title}</p>
                    {result.doc.content && (
                      <p className="text-sm text-muted-foreground">
                        {result.doc.content.substring(0, 70)}...
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              query.length > 1 && <p className="p-4 text-center text-sm text-muted-foreground">No results found.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
