"use client"

import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFile,
} from "@codesandbox/sandpack-react"
import { nightOwl } from "@codesandbox/sandpack-themes"
import React, { Children } from "react"
import { renderToStaticMarkup } from "react-dom/server"

const sandpackTheme = {
  ...nightOwl,
  colors: {
    ...nightOwl.colors,
    surface1: "#011627", // editor background
  },
}

function getCode(children: React.ReactNode) {
  if (typeof children === "string") return children
  if (!children) return ""

  const childArray = Children.toArray(children)
  return childArray.map((child: any) => {
    if (typeof child === 'string') return child
    if (child.props && child.props.children) {
      return getCode(child.props.children)
    }
    return ''
  }).join('');
}


export function ComponentPreview({ children }: { children: React.ReactNode }) {
  const code = React.useMemo(() => {
    const staticMarkup = renderToStaticMarkup(<>{children}</>)
    const codeString = staticMarkup
        .replace(/<div class="flex flex-wrap gap-2">/g, '')
        .replace(/<\/div>/g, '')
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"');
    
    // a basic formatter
    return codeString.split('><').join('>\n  <')
  }, [children])

  const appCode = `
import { Badge } from "./badge"

export default function App() {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      ${code}
    </div>
  )
}
`

  const badgeCode = `
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "./utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
`

  const utilsCode = `
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`

  return (
    <div className="my-6 not-prose">
      <SandpackProvider
        template="react"
        theme={sandpackTheme}
        files={{
          "/App.js": appCode,
          "/badge.js": { code: badgeCode, hidden: true },
          "/utils.js": { code: utilsCode, hidden: true },
        }}
        customSetup={{
          dependencies: {
            "class-variance-authority": "^0.7.0",
            clsx: "^2.1.1",
            "tailwind-merge": "^2.3.0",
            react: "^18.3.1",
            "react-dom": "^18.3.1",
          },
        }}
      >
        <SandpackLayout>
          <SandpackCodeEditor style={{ height: "auto" }} />
          <SandpackPreview style={{ height: "auto" }} />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  )
}
