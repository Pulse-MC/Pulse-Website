import React, { ReactNode } from 'react';

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export interface DocPage {
  path: string;
  title: string;
  emoji?: string;
  component: React.ComponentType<any>;
  priority: number;
  category: string;
  toc?: Array<TocItem>;
  parent?: string;
}

export interface CategoryMeta {
  name: string;
  priority: number;
  emoji?: string;
}

// Загружаем файлы
const modules = import.meta.glob('./pages/**/*.tsx', { eager: true });
const metaModules = import.meta.glob('./pages/**/_category.ts', { eager: true });

class DocsRegistry {
  private pages: Array<DocPage> = [];
  private categoriesMeta: Record<string, CategoryMeta> = {};

  constructor() {
    Object.entries(metaModules).forEach(([filePath, mod]: [string, any]) => {
      const folderName = filePath.split('/')[2]; 
      const meta = mod.default;
      
      if (meta && meta.name) {
        this.categoriesMeta[folderName] = meta;
      }
    });

    this.pages = Object.entries(modules)
      .map(([filePath, mod]: [string, any]) => {
        const folderName = filePath.split('/')[2];
        const categoryData = this.categoriesMeta[folderName];
        
        const Component = mod.default;
        const config = mod.config || (Component && Component.config);

        if (Component && config) {
          return {
            ...config,
            category: categoryData ? categoryData.name : folderName,
            component: Component
          };
        }
        return null;
      })
      .filter((page): page is DocPage => page !== null)
      .sort((a, b) => a.priority - b.priority);
  }

  getPages() { return this.pages; }
  getPage(path: string | undefined) { return this.pages.find(p => p.path === path); }
  getCategoryPriority(categoryName: string): number {
    // Ищем приоритет по имени категории (name)
    const foundMeta = Object.values(this.categoriesMeta).find(m => m.name === categoryName);
    return foundMeta ? foundMeta.priority : 999;
  }

  getCategoryEmoji(categoryName: string): ReactNode {
    const foundMeta = Object.values(this.categoriesMeta).find(m => m.name.trim().toLocaleUpperCase() === categoryName.trim().toLocaleUpperCase());
    return foundMeta?.emoji || "";
  }
}

export const docsModule = new DocsRegistry();