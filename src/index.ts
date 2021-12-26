import { buildSqlByTemplate, mergeSqlByTemplate, Statement, StringFormat, Template } from './core';
import { Build } from './search';
import { buildTemplates } from './xml';

export * from './core';
export * from './build';
export * from './xml';
export * from './metadata';
export * from './search';

export type TemplateMap = Map<string, Template>;
export class TemplateManager {
  cacheFormats: Map<string, StringFormat>;
  constructor() {
    this.cacheFormats = new Map<string, StringFormat>();
    this.merge = this.merge.bind(this);
  }
  merge(template: Template, obj: any): string {
    return mergeSqlByTemplate(obj, template, this.cacheFormats);
  }
  build(template: Template, obj: any, param: (i: number) => string): Statement {
    return buildSqlByTemplate(obj, template, this.cacheFormats, param);
  }
}
export class TemplatesManager {
  constructor(streams: string[], correct?: (stream: string) => string) {
    this.templates = buildTemplates(streams, correct);
    this.cacheFormats = new Map<string, StringFormat>();
    this.merge = this.merge.bind(this);
  }
  templates: Map<string, Template>;
  cacheFormats: Map<string, StringFormat>;
  getTemplate(id: string): Template | undefined {
    return this.templates.get(id);
  }
  merge(key: string, obj: any): string {
    const template = this.templates.get(key);
    if (!template) {
      return '';
    }
    return mergeSqlByTemplate(obj, template, this.cacheFormats);
  }
}
export function useTemplate(mapper?: Map<string, Template>): Build | undefined {
  if (!mapper) {
    return undefined;
  }
  const t = new TemplateManager();
  return t.build;
}

