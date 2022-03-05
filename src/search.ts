import { build, Statement, Template } from './core';
import { Attribute, Attributes, StringMap } from './metadata';

export type Build = (obj: any, template: Template, param: (i: number) => string, skipArray?: boolean) => Statement;
export type Query = <S>(filter: S, bparam: LikeType | ((i: number) => string), sn?: string, buildSort?: (sort?: string, map?: Attributes | StringMap) => string, attrs?: Attributes) => Statement | undefined;
export type BuildFilter = <S>(filter: S, q?: string, useContain?: boolean, attrs?: Attributes) => S;
export function useQuery(id?: string, mapper?: Map<string, Template>, attrs?: Attributes, useContain?: boolean, skipArray?: boolean, q?: string, sort?: string): Query | undefined {
  if (id && mapper) {
    const template = mapper.get(id);
    if (template) {
      const query = useQueryBuilder(template, attrs, useContain, skipArray, q, sort);
      return query.buildQuery;
    }
  }
  return undefined;
}
export function buildDollarParam(i: number): string {
  return '$' + i;
}
export type LikeType = 'like' | 'ilike';
export function useQueryBuilder<S>(template: Template, attributes?: Attributes, useContain?: boolean, skipArray?: boolean, q?: string, sort?: string): QueryBuilder<S> {
  return new QueryBuilder<S>(template, useContain, undefined, attributes, q, sort, skipArray);
}
export class QueryBuilder<S> {
  constructor(public template: Template, public useContain?: boolean, bf?: BuildFilter, public attributes?: Attributes, q?: string, sort?: string, public skipArray?: boolean) {
    this.sort = (sort ? sort : 'sort');
    this.q = (q ? q : 'q');
    this.buildFilter = bf ? bf : buildFilter;
    this.buildQuery = this.buildQuery.bind(this);
  }
  buildFilter: BuildFilter;
  sort: string;
  q: string;
  buildQuery(filter: S, bparam: LikeType | ((i: number) => string), sn?: string, buildSort?: (sort?: string, map?: Attributes | StringMap) => string, attrs?: Attributes): Statement | undefined {
    const f2 = this.buildFilter(filter, this.q, this.useContain, this.attributes ? this.attributes : attrs);
    if (sn && sn.length > 0 && buildSort) {
      const sort = buildSort(sn);
      (f2 as any)[this.sort] = sort;
    }
    let param1: (i: number) => string;
    if (typeof bparam === 'string') {
      param1 = buildDollarParam;
    } else {
      param1 = bparam;
    }
    return build(f2, this.template, param1, this.skipArray);
  }
}
export function buildFilter<S>(filter: S, q?: string, useContain?: boolean, attrs?: Attributes): S {
  const obj2 = {} as any;
  const s: any = filter;
  const keys = Object.keys(s);
  for (const key of keys) {
    let v = s[key];
    if (v !== undefined && v != null && v !== '') {
      if (typeof v === 'string') {
        v = v.trim();
        if (v !== '') {
          if (key === q) {
            if (useContain) {
              obj2[key] = '%' + v + '%';
            } else {
              obj2[key] = v + '%';
            }
          } else {
            if (attrs) {
              const attr: Attribute = attrs[key];
              if (attr) {
                if (attr.match === 'prefix') {
                  obj2[key] = v + '%';
                } else if (attr.match === 'equal') {
                  obj2[key] = v;
                } else {
                  obj2[key] = '%' + v + '%';
                }
              } else {
                obj2[key] = v;
              }
            } else {
              obj2[key] = v;
            }
          }
        }
      } else {
        obj2[key] = v;
      }
    }
  }
  return obj2;
}
