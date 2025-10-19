import { notFound } from "next/navigation"
import { getDocBySlug, getAdjacentDocs } from "@/lib/docs"
import { mdxComponents } from "@/components/mdx-components"
import { MDXRemote } from "next-mdx-remote/rsc"
import { Toc } from "@/components/toc"
import { DocsPageHeader } from "@/components/docs-page-header"
import { DocsPager } from "@/components/docs-pager"
import type { Metadata } from "next"

import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import remarkGfm from "remark-gfm"

interface DocPageProps {
  params: {
    slug: string[]
  }
}

async function getDocFromParams({ params }: DocPageProps) {
  const slug = params.slug || []
  const doc = await getDocBySlug(slug)

  if (!doc) {
    return null
  }

  return doc
}

export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  const doc = await getDocFromParams({ params })

  if (!doc) {
    return {}
  }

  return {
    title: doc.title,
    description: doc.description,
  }
}

export default async function DocPage({ params }: DocPageProps) {
  const doc = await getDocFromParams({ params })

  if (!doc) {
    notFound()
  }

  const slug = params.slug ? params.slug.join('/') : ''
  const { prev, next } = await getAdjacentDocs(`/docs/${slug}`)

  const mdxOptions = {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["subtle-heading-anchor"],
            "aria-label": "Link to section",
          },
        },
      ],
      [
        rehypePrettyCode,
        {
          theme: "nord",
          onVisitLine(node: any) {
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }]
            }
          },
          onVisitHighlightedLine(node: any) {
            node.properties.className.push("line--highlighted")
          },
          onVisitHighlightedWord(node: any) {
            node.properties.className = ["word--highlighted"]
          },
        },
      ],
    ],
  }

  return (
    <div className="flex-1 md:grid md:grid-cols-[1fr_240px] md:gap-10">
      <div className="min-w-0">
        <DocsPageHeader heading={doc.title} text={doc.description} />
        <MDXRemote
          source={doc.content}
          options={{
            mdxOptions: {
              ...mdxOptions,
              // @ts-expect-error
              async rehype(rehype) {
                return rehype.use(rehypePrettyCode, {
                  theme: "nord",
                  showLineNumbers: true,
                })
              },
              async remark(remark) {
                return remark.use(remarkGfm)
              },
            },
            parseFrontmatter: true,
          }}
          components={mdxComponents}
        />
        <hr className="my-4 md:my-6" />
        <DocsPager prev={prev} next={next} />
      </div>
      <div className="hidden text-sm md:block">
        <div className="sticky top-16 -mt-10 max-h-[calc(100vh-3.5rem)] overflow-y-auto pt-10">
          <Toc toc={doc.toc} />
        </div>
      </div>
    </div>
  )
}
