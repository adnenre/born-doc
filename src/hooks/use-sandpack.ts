"use client"

import { Children, isValidElement } from "react"
import { SandpackFile, SandpackFiles } from "@codesandbox/sandpack-react"

export const useSandpack = (children: React.ReactNode) => {
  const code = (Children.toArray(children) as React.ReactElement[])
    .map((child) => {
      if (typeof child.props.children === "string") {
        return child.props.children
      }
      return ""
    })
    .join("\n")

  const files = Children.toArray(children).reduce(
    (acc, child) => {
      if (
        !isValidElement(child) ||
        (child.type as any).displayName !== "SandpackFile"
      ) {
        return acc
      }

      const { props } = child as React.ReactElement<
        React.ComponentProps<typeof SandpackFile>
      >
      const filePath = props.path
      const fileCode = props.children
      const fileHidden = props.hidden
      const fileActive = props.active

      if (typeof fileCode !== "string") return acc

      acc[filePath] = {
        code: fileCode,
        hidden: fileHidden,
        active: fileActive,
      }

      return acc
    },
    {} as SandpackFiles
  )

  return { code, files }
}
