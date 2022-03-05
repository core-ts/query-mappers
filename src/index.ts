import { build, mergeSqlByTemplate, Statement, StringFormat, Template } from './core';
import { Attribute, StringMap } from './metadata';
import { Build } from './search';

export * from './core';
export * from './build';
export * from './xml';
export * from './metadata';
export * from './search';

export type TemplateMap = Map<string, Template>;
/*
export class TemplateManager {
  // cacheFormats: Map<string, StringFormat>;
  constructor() {
    // this.cacheFormats = new Map<string, StringFormat>();
    this.merge = this.merge.bind(this);
    this.build = this.build.bind(this);
  }
  merge(template: Template, obj: any): string {
    return mergeSqlByTemplate(obj, template);
  }
  build(template: Template, obj: any, param: (i: number) => string, skipArray?: boolean): Statement {
    return build(obj, template, param, skipArray);
  }
}
*/
export interface DB {
  driver: string;
  param(i: number): string;
  exec(sql: string, args?: any[], ctx?: any): Promise<number>;
  execBatch(statements: Statement[], firstSuccess?: boolean, ctx?: any): Promise<number>;
  query<T>(sql: string, args?: any[], m?: StringMap, bools?: Attribute[], ctx?: any): Promise<T[]>;
  queryOne<T>(sql: string, args?: any[], m?: StringMap, bools?: Attribute[], ctx?: any): Promise<T|null>;
  execScalar<T>(sql: string, args?: any[], ctx?: any): Promise<T>;
  count(sql: string, args?: any[], ctx?: any): Promise<number>;
}
export class Mapper {
  constructor(public templates: Map<string, Template>, public db: DB, skipArray?: boolean) {
    // this.cacheFormats = new Map<string, StringFormat>();
    if (skipArray !== undefined) {
      this.skipArray = skipArray;
    } else if (db.driver === 'postgres') {
      this.skipArray = true;
    }
    this.getTemplate = this.getTemplate.bind(this);
    this.merge = this.merge.bind(this);
    this.exec = this.exec.bind(this);
    this.execBatch = this.execBatch.bind(this);
    this.query = this.query.bind(this);
    this.queryOne = this.queryOne.bind(this);
    this.execScalar = this.execScalar.bind(this);
    this.count = this.count.bind(this);
  }
  skipArray?: boolean;
  // cacheFormats: Map<string, StringFormat>;
  getTemplate(id: string): Template | undefined {
    return this.templates.get(id);
  }
  merge(key: string, obj: any): string {
    const template = this.templates.get(key);
    if (!template) {
      return '';
    }
    return mergeSqlByTemplate(obj, template);
  }
  exec(key: string, obj: any, ctx?: any): Promise<number> {
    const t = this.templates.get(key);
    if (t) {
      const s = build(obj, t, this.db.param, this.skipArray);
      return this.db.exec(s.query, s.params, ctx);
    } else {
      return Promise.resolve(-1);
    }
  }
  execBatch(keys: string[], objs: any[], firstSuccess?: boolean, ctx?: any): Promise<number> {
    if (keys.length !== objs.length) {
      return Promise.resolve(-3);
    } else {
      const ss: Statement[] = [];
      const l = keys.length;
      for (let i = 0; i < l; i++) {
        const key = keys[i];
        const obj = objs[i];
        const t = this.templates.get(key);
        if (!t) {
          return Promise.resolve(-2);
        } else {
          const s = build(obj, t, this.db.param, this.skipArray);
          ss.push(s);
        }
      }
      return this.db.execBatch(ss, firstSuccess, ctx);
    }
  }
  query<T>(key: string, obj: any, m?: StringMap, bools?: Attribute[], ctx?: any): Promise<T[]> {
    const t = this.templates.get(key);
    if (t) {
      const s = build(obj, t, this.db.param, this.skipArray);
      return this.db.query(s.query, s.params, m, bools, ctx);
    } else {
      return Promise.resolve([]);
    }
  }
  queryOne<T>(key: string, obj: any, m?: StringMap, bools?: Attribute[], ctx?: any): Promise<T|null> {
    const t = this.templates.get(key);
    if (t) {
      const s = build(obj, t, this.db.param, this.skipArray);
      return this.db.queryOne(s.query, s.params, m, bools, ctx);
    } else {
      return Promise.resolve(null);
    }
  }
  execScalar<T>(key: string, obj: any, ctx?: any): Promise<T> {
    const t = this.templates.get(key);
    if (t) {
      const s = build(obj, t, this.db.param, this.skipArray);
      return this.db.execScalar(s.query, s.params, ctx);
    } else {
      throw new Error('Cannot find template with key ' + key);
    }
  }
  count(key: string, obj: any, ctx?: any): Promise<number> {
    const t = this.templates.get(key);
    if (t) {
      const s = build(obj, t, this.db.param, this.skipArray);
      return this.db.count(s.query, s.params, ctx);
    } else {
      return Promise.resolve(-1);
    }
  }
}
export const TemplatesManager = Mapper;
export function useTemplate(mapper?: Map<string, Template>): Build | undefined {
  if (!mapper) {
    return undefined;
  }
  // const t = new TemplateManager();
  // return t.build;
  return build;
}
