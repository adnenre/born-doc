import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <div className="rounded-full border bg-card p-4 shadow-sm">
          <BookOpen className="h-12 w-12 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="font-headline text-4xl font-bold tracking-tight md:text-6xl flex items-center gap-4">
            Born Docs <Badge>Beta</Badge>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Your guide to building beautiful applications. Explore components, guides, and theme documentation.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/docs/getting-started/introduction">
              Explore Docs <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </Button>
        </div>
      </div>
      <footer className="absolute bottom-4 text-center text-sm text-muted-foreground">
        <p>Built with Next.js and Tailwind CSS. Inspired by Nextra.</p>
      </footer>
    </main>
  );
}
