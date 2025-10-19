"use client"

import sdk from "@stackblitz/sdk"
import * as React from "react"

import { Button, ButtonProps } from "@/components/ui/button"
import { useSandpack } from "@/hooks/use-sandpack"

interface StackBlitzButtonProps extends ButtonProps {
  code: string
}

export function StackBlitzButton({
  code,
  className,
  ...props
}: StackBlitzButtonProps) {
  const { files } = useSandpack(code)

  const openInStackBlitz = () => {
    sdk.openProject(
      {
        title: "Component Preview",
        description: "A live preview of the component.",
        template: "nextjs",
        files: {
          ...files,
          "app/page.tsx": `
import {NextUIProvider} from "@nextui-org/react";

export default function Home() {
  return (
    <NextUIProvider>
      ${code}
    </NextUIProvider>
  );
}
`,
        },
      },
      {
        openFile: "app/page.tsx",
      }
    )
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      className="h-7 w-7 text-white hover:bg-zinc-700 hover:text-white"
      onClick={openInStackBlitz}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 28 28"
        height="16"
        width="16"
        fill="none"
      >
        <path
          fill="currentColor"
          d="M12.74 2.113l-9.92 10.89a2.342 2.342 0 00.102 3.295l7.53 5.423.001-.002 2.384 1.716a2.343 2.343 0 002.34-.002l9.92-10.89a2.342 2.342 0 00-.102-3.295l-7.53-5.423-.001.002-2.384-1.716a2.343 2.343 0 00-2.34.002zM11.258 24.18l-7.53-5.424a.836.836 0 01-.036-1.176l9.92-10.89a.837.837 0 011.23.036l7.53 5.424a.836.836 0 01.036 1.176l-9.92 10.89a.837.837 0 01-1.23-.036z"
        ></path>
      </svg>
      <span className="sr-only">Open in StackBlitz</span>
    </Button>
  )
}
