import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cache } from "react";
import type { NavItem, Doc, TocEntry } from "./types";
import { glob } from "glob";
import { VFile } from "vfile";
import { matter as vfileMatter } from "vfile-matter";
import readingTime from "reading-time";

const contentDir = path.join(process.cwd(), "src", "content", "docs");

function toTitleCase(str: string) {
  return str.replace(/-/g, " ").replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

export const getDocsNavigation = cache(async (): Promise<NavItem[]> => {
  const files = await glob("**/*.mdx", { cwd: contentDir });

  const navItems: NavItem[] = [];
  const itemMap = new Map<string, NavItem>();

  files.sort((a, b) => a.localeCompare(b));

  for (const file of files) {
    const pathParts = file.replace(/^en\//, "").split(path.sep);
    let currentPath = "";
    let parentMap = itemMap;
    let parentList = navItems;

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      currentPath = path.join(currentPath, part);

      if (i === pathParts.length - 1) {
        // It's a file
        const slug = `/docs/${file.replace(/\.mdx$/, "").replace(/\\/g, "/")}`;
        const filePath = path.join(contentDir, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(fileContent);

        const title = data.title || toTitleCase(path.basename(part, ".mdx"));

        const navItem: NavItem = { title, slug };
        parentList.push(navItem);
      } else {
        // It's a directory
        if (!parentMap.has(part)) {
          const title = toTitleCase(part);
          const newGroup: NavItem = {
            title: title,
            slug: `/docs/${path.join(...pathParts.slice(0, i + 1))}`,
            children: [],
          };
          parentList.push(newGroup);
          parentMap.set(part, newGroup);
        }
        parentList = parentMap.get(part)!.children!;
      }
    }
  }

  const sortNav = (items: NavItem[]) => {
    items.sort((a, b) => {
      const aIsGroup = !!a.children;
      const bIsGroup = !!b.children;
      if (aIsGroup && !bIsGroup) return -1;
      if (!aIsGroup && bIsGroup) return 1;
      return a.title.localeCompare(b.title);
    });
    items.forEach((item) => {
      if (item.children) {
        sortNav(item.children);
      }
    });
  };

  sortNav(navItems);

  return navItems;
});

export const getDocBySlug = cache(async (slug: string[]): Promise<Doc | null> => {
  const slugPath = slug.join("/");
  let filePath = path.join(contentDir, `${slugPath}.mdx`);

  if (!fs.existsSync(filePath)) {
    // Fallback for paths that might still have 'en'
    filePath = path.join(contentDir, `${slugPath}.mdx`);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(contentDir, slugPath, "index.mdx");
      if (!fs.existsSync(filePath)) {
        return null;
      }
    }
  }

  const source = fs.readFileSync(filePath, "utf-8");
  const file = new VFile(source);
  vfileMatter(file, { strip: true });

  const { data, content } = matter(source);

  const toc: TocEntry[] = [];
  const lines = content.split("\n");
  for (const line of lines) {
    const match = line.match(/^(#{2,4})\s+(.*)/);
    if (match) {
      const level = match[1].length;
      const text = match[2];
      const slug = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
      toc.push({ level, text, slug });
    }
  }

  return {
    title: data.title || toTitleCase(path.basename(filePath, ".mdx")),
    description: data.description || "",
    content,
    toc,
    readingTime: readingTime(content).text,
  };
});

export const getAdjacentDocs = cache(async (slug: string) => {
  const navItems = await getDocsNavigation();
  const allDocs: NavItem[] = [];

  function flattenNavItems(items: NavItem[]) {
    for (const item of items) {
      if (item.children) {
        flattenNavItems(item.children);
      } else {
        allDocs.push(item);
      }
    }
  }
  flattenNavItems(navItems);

  const currentIndex = allDocs.findIndex((doc) => doc.slug === slug);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  const prev = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
  const next = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;

  return { prev, next };
});
