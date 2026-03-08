// Types for Moko Tooling & Utils

export interface Tool {
  id: string;
  name: string;
  url: string;
  description: string;
  shortcut?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
  tools: Tool[];
}

export interface ToolsData {
  categories: Category[];
}
