import fs from "fs/promises";
import path from "path";
import { glob } from "glob";
import matter from "gray-matter";
import stripMarkdown from "strip-markdown";
import { remark } from "remark";

const contentDir = path.join(process.cwd(), "src", "content", "docs");
const outputFile = path.join(process.cwd(), "public", "search-index.json");

function toTitleCase(str) {
  return str.replace(/-/g, " ").replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

async function buildSearchIndex() {
  const files = await glob("**/*.mdx", { cwd: contentDir });

  const index = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(contentDir, file);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      const strippedContent = await remark().use(stripMarkdown).process(content);

      const slug = `/docs/${file.replace(/(\/index)?\.mdx$/, "")}`;

      return {
        slug: slug,
        title: data.title || toTitleCase(path.basename(file, ".mdx")),
        content: strippedContent.value.toString().replace(/\s+/g, " ").substring(0, 150),
      };
    })
  );

  await fs.writeFile(outputFile, JSON.stringify(index, null, 2));
}

buildSearchIndex().catch(console.error);
