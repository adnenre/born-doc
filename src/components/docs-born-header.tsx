import Image from "next/image"
import { mdxComponents } from "@/components/mdx-components"

interface DocsBornHeaderProps {
  title: string
  iconName: keyof typeof mdxComponents
}

export function DocsBornHeader({ title, iconName }: DocsBornHeaderProps) {
  const Icon = mdxComponents[iconName] as React.ElementType

  return (
    <div className="mb-8 flex items-center gap-4 rounded-lg border bg-card p-6 shadow-sm">
      {Icon && <Icon className="h-10 w-10 text-primary" />}
      <h1 className="font-headline text-4xl font-bold tracking-tight">
        What is {title}
      </h1>
    </div>
  )
}
