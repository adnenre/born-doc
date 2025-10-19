export interface NavItem {
  title: string;
  slug: string;
  children?: NavItem[];
}

export interface Doc {
  title: string;
  description?: string;
  content: string;
  toc: TocEntry[];
  readingTime: string;
}

export interface TocEntry {
  level: number;
  text: string;
  slug: string;
}
