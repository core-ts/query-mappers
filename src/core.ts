const reg = /'/gi;
export enum ParameterType {
  text = 'text',
  param = 'param'
}
export enum TemplateType {
  text = 'text',
  isNotNull = 'isNotNull',
  isNull = 'isNull',
  isEqual = 'isEqual',
  isNotEqual = 'isNotEqual',
  isEmpty = 'isEmpty',
  isNotEmpty = 'isNotEmpty'
}
export interface Statement {
  query: string;
  params?: any[];
}
export interface TmpStatement {
  query: string;
  params?: any[];
  i: number;
}
export interface Parameter {
  name: string;
  type: string;
}
export interface StringFormat {
  texts: string[];
  parameters: Parameter[];
}
export interface TemplateMap {
  [key: string]: Template;
}
export interface Template {
  name?: string | null;
  text: string;
  templates: TemplateNode[];
}
export interface TemplateNode {
  type: string;
  text: string;
  property: string | null;
  encode?: string | null;
  value: string | null;
}

export function buildFormat(str: string): StringFormat {
  const texts = [];
  const parameters = [];
  let from = 0;
  let from2 = 0;
  let i = 0;
  let j = 0;
  while (true) {
    i = str.indexOf('{', from2);
    if (i >= 0) {
      j = str.indexOf('}', i + 1);
      if (j >= 0) {
        const pro = str.substring(i + 1, j);
        if (isValidProperty(pro)) {
          let name: string;
          let type: string;
          name = pro;
          if (i >= 1) {
            const chr = str[i - 1];
            switch (chr) {
              case '#':
                texts.push(str.substring(from, i - 1));
                type = ParameterType.param;
                break;
              case '$':
                texts.push(str.substring(from, i - 1));
                type = ParameterType.text;
                break;
              default:
                texts.push(str.substring(from, i));
                type = ParameterType.text;
                break;
            }
          } else {
            texts.push(str.substring(from, i));
            type = ParameterType.text;
          }
          const parameter: Parameter = { name, type };
          parameters.push(parameter);
          from = j + 1;
          from2 = from;
        } else {
          from2 = j + 1;
        }
      } else {
        from = i + 1;
        from2 = from;
      }
    } else {
      texts.push(str.substring(from));
      break;
    }
  }
  const format: StringFormat = { texts, parameters };
  return format;
}
export function renderTemplateNodes(templateNodes: TemplateNode[], obj: any): TemplateNode[] {
  const nodes: TemplateNode[] = [];
  for (const sub of templateNodes) {
    let attr: any;
    if (sub.property && sub.property.length > 0) {
      attr = valueOf(obj, sub.property);
      // attr = (typeof v === 'string' ? v : ('' + v));
    }
    const t = sub.type;
    if (t === TemplateType.text) {
      nodes.push(sub);
    } else if (t === TemplateType.isNotNull) {
      if (attr !== undefined && attr != null) {
        if (Array.isArray(attr)) {
          if (attr.length > 0) {
            nodes.push(sub);
          }
        } else {
          nodes.push(sub);
        }
      }
    } else if (t === TemplateType.isNull) {
      if (attr === undefined || attr == null || (Array.isArray(attr) && attr.length === 0)) {
        nodes.push(sub);
      }
    } else if (t === TemplateType.isEqual) {
      if (attr !== undefined && attr != null) {
        attr = '' + attr;
        if (attr === sub.value) {
          nodes.push(sub);
        }
      }
    } else if (t === TemplateType.isNotEqual) {
      if (attr !== undefined && attr != null) {
        attr = '' + attr;
        if (attr !== sub.value) {
          nodes.push(sub);
        }
      }
    } else if (t === TemplateType.isEmpty) {
      if (attr === '') {
        nodes.push(sub);
      }
    } else if (t === TemplateType.isNotEmpty) {
      if (attr !== '') {
        nodes.push(sub);
      }
    }
  }
  return nodes;
}
export function mergeStringFormat(format: StringFormat, obj: any): string {
  const results: string[] = [];
  const texts = format.texts;
  const parameters = format.parameters;
  const length = parameters.length;
  for (let i = 0; i < length; i++) {
    results.push(texts[i]);
    const p = obj[parameters[i].name];
    if (p && p.length > 0) {
      results.push(p);
    }
  }
  if (texts[length] && texts[length].length > 0) {
    results.push(texts[length]);
  }
  return results.join('');
}
export function merge(obj: any, format: StringFormat, param: (i: number) => string, j: number): TmpStatement {
  const results: string[] = [];
  const texts = format.texts;
  const parameters = format.parameters;
  const length = parameters.length;
  let k = j;
  const params = [];
  for (let i = 0; i < length; i++) {
    results.push(texts[i]);
    const p = valueOf(obj, parameters[i].name);
    if (p) {
      if (parameters[i].type === ParameterType.text) {
        results.push(p);
      } else {
        if (Array.isArray(p)) {
          if (p.length > 0) {
            const sa: string[] = [];
            for (const sp of p) {
              sa.push(param(k));
              params.push(sp);
              k = k + 1;
            }
            results.push(sa.join(','));
          }
        } else {
          results.push(param(k));
          params.push(p);
          k = k + 1;
        }
      }
    }
  }
  if (texts[length] && texts[length].length > 0) {
    results.push(texts[length]);
  }
  return { query: results.join(''), params, i: k };
}
export function isValidProperty(str: string): boolean {
  for (let i = 0; i < str.length; i++) {
    const chr = str.charAt(i);
    if (chr === '.' || chr === '_') {
      continue;
    }
    if (!(chr >= 'a' && chr <= 'z'
      || chr >= 'A' && chr <= 'Z'
      || chr >= '0' && chr <= '9')) {
      return false;
    }
  }
  return true;
}
export function getStringFormat(str: string, cacheFormats?: Map<string, StringFormat>): StringFormat {
  if (cacheFormats) {
    let format: StringFormat | undefined = cacheFormats.get(str);
    if (!format) {
      format = buildFormat(str);
      cacheFormats.set(str, format);
    }
    return format;
  } else {
    return buildFormat(str);
  }
}
export function getText(str: string, templates: Map<string, Template>): string {
  const template: Template | undefined = templates.get(str);
  return (!template ? '' : template.text);
}
// sql
export function build(obj: any, template: Template, cacheFormats: Map<string, StringFormat>, param: (i: number) => string): Statement {
  const results: string[] = [];
  const templateNodes: TemplateNode[] = template.templates;
  const renderNodes: TemplateNode[] = renderTemplateNodes(templateNodes, obj);
  let i = 1;
  const params = [];
  for (const sub of renderNodes) {
    const format: StringFormat = getStringFormat(sub.text, cacheFormats);
    let s: TmpStatement;
    if (sub.type === TemplateType.text) {
      s = merge(obj, format, param, i);
      i = s.i;
      if (s && s.query && s.query.length > 0) {
        results.push(s.query);
        if (s.params && s.params.length > 0) {
          for (const p of s.params) {
            params.push(p);
          }
        }
      }
    } else {
      s = merge(obj, format, param, i);
      i = s.i;
      if (s && s.query && s.query.length > 0) {
        results.push(s.query);
        if (s.params && s.params.length > 0) {
          for (const p of s.params) {
            params.push(p);
          }
        }
      }
    }
  }
  const query = results.join('');
  return { query, params };
}
export function mergeSqlByTemplate(obj: any, template: Template, cacheFormats: Map<string, StringFormat>): string {
  const results = [];
  const templateNodes: TemplateNode[] = template.templates;
  const renderNodes: TemplateNode[] = renderTemplateNodes(templateNodes, obj);
  for (const sub of renderNodes) {
    const format: StringFormat = getStringFormat(sub.text, cacheFormats);
    let s: string;
    if (sub.type === TemplateType.text) {
      s = mergeSqlStringFormat(format, obj);
    } else {
      s = ('false' === sub.encode ? mergeStringFormat(format, obj) : mergeSqlStringFormat(format, obj));
    }
    if (s && s.length > 0) {
      results.push(s);
    }
  }
  return results.join('');
}
export function mergeSqlStringFormat(format: StringFormat, obj: any): string {
  const results: string[] = [];
  const texts = format.texts;
  const parameters = format.parameters;
  const length = parameters.length;
  for (let i = 0; i < length; i++) {
    results.push(texts[i]);
    const p = getSqlValue(obj[parameters[i].name]);
    if (p) {
      results.push(p);
    }
  }
  if (texts[length] && texts[length].length > 0) {
    results.push(texts[length]);
  }
  return results.join('');
}
export function encodeSql(v: string): string {
  return (v.indexOf(`'`) < 0 ? v : v.replace(reg, `''`));
}
export function getSqlValue(obj: any): string {
  if (typeof obj === 'string') {
    return encodeSql(obj);
  } else if (typeof obj === 'number') {
    return obj.toString();
  } else if (obj instanceof Date) {
    return obj.toISOString();
  } else {
    return encodeSql('' + obj);
  }
}
export function getDirectValue(obj: any, key: string): any {
  if (obj && obj.hasOwnProperty(key)) {
    return obj[key];
  }
  return null;
}
export function valueOf(obj: any, key: string): any {
  const mapper = key.split('.').map(item => {
    return item.replace(/\[/g, '.[').replace(/\[|\]/g, '');
  });
  const reSplit = mapper.join('.').split('.');
  return reSplit.reduce((acc, current, index, source) => {
    const value = getDirectValue(acc, current);
    if (!value) {
      source.splice(1);
    }
    return value;
  }, obj);
}
