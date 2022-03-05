import { buildFormat, Template, TemplateNode, TemplateType } from './core';

const regexp = new RegExp(' >= ', 'gi');
const regexp2 = new RegExp(' <= ', 'gi');
const regexp3 = new RegExp(' > ', 'gi');
const regexp4 = new RegExp(' < ', 'gi');
const regexp5 = new RegExp(' && ', 'gi');
const regexp6 = new RegExp(' ?& ', 'gi');
const regexp7 = new RegExp(' -> ', 'gi');
const regexp8 = new RegExp(' ->> ', 'gi');
const regexp9 = new RegExp(' #> ', 'gi');
const regexp10 = new RegExp(' #>> ', 'gi');
const regexp11 = new RegExp(' @> ', 'gi');
const regexp12 = new RegExp(' >@ ', 'gi');
const regexp13 = new RegExp(' <@ ', 'gi');
const regexp14 = new RegExp(' @< ', 'gi');
const regexp30 = new RegExp('\r\n', 'gi');
const regexp31 = new RegExp('\r', 'gi');
const regexp32 = new RegExp('\n', 'gi');
const regexp33 = new RegExp('    ', 'gi');
const regexp34 = new RegExp('  ', 'gi');
export function correctXml(stream: string): string {
  let text = stream;
  if (text.indexOf(' >= ') >= 0) {
    text = text.replace(regexp, ' &gt;= ');
  }
  if (text.indexOf(' <= ') >= 0) {
    text = text.replace(regexp2, ' &lt;= ');
  }
  if (text.indexOf(' > ') >= 0) {
    text = text.replace(regexp3, ' &gt; ');
  }
  if (text.indexOf(' < ') >= 0) {
    text = text.replace(regexp4, ' &lt; ');
  }
  if (text.indexOf(' && ') >= 0) {
    text = text.replace(regexp5, ' &amp;&amp; ');
  }
  if (text.indexOf(' ?& ') >= 0) {
    text = text.replace(regexp6, ' ?&amp; ');
  }
  if (text.indexOf(' -> ') >= 0) {
    text = text.replace(regexp7, ' -&gt; ');
  }
  if (text.indexOf(' ->> ') >= 0) {
    text = text.replace(regexp8, ' -&gt;&gt; ');
  }
  if (text.indexOf(' #> ') >= 0) {
    text = text.replace(regexp9, ' #&gt; ');
  }
  if (text.indexOf(' #>> ') >= 0) {
    text = text.replace(regexp10, ' #&gt;&gt; ');
  }
  if (text.indexOf(' @> ') >= 0) {
    text = text.replace(regexp11, ' @&gt; ');
  }
  if (text.indexOf(' >@ ') >= 0) {
    text = text.replace(regexp12, ' &gt;@ ');
  }
  if (text.indexOf(' <@ ') >= 0) {
    text = text.replace(regexp13, ' &lt;@ ');
  }
  if (text.indexOf(' @< ') >= 0) {
    text = text.replace(regexp14, ' @&lt; ');
  }
  return text;
}
export function trim(stream: string): string {
  let text = stream;
  if (text.indexOf(' >= ') >= 0) {
    text = text.replace(regexp, ' &gt;= ');
  }
  if (text.indexOf(' <= ') >= 0) {
    text = text.replace(regexp2, ' &lt;= ');
  }
  if (text.indexOf(' > ') >= 0) {
    text = text.replace(regexp3, ' &gt; ');
  }
  if (text.indexOf(' < ') >= 0) {
    text = text.replace(regexp4, ' &lt; ');
  }
  if (text.indexOf(' && ') >= 0) {
    text = text.replace(regexp5, ' &amp;&amp; ');
  }
  if (text.indexOf(' ?& ') >= 0) {
    text = text.replace(regexp6, ' ?&amp; ');
  }
  if (text.indexOf(' -> ') >= 0) {
    text = text.replace(regexp7, ' -&gt; ');
  }
  if (text.indexOf(' ->> ') >= 0) {
    text = text.replace(regexp8, ' -&gt;&gt; ');
  }
  if (text.indexOf(' #> ') >= 0) {
    text = text.replace(regexp9, ' #&gt; ');
  }
  if (text.indexOf(' #>> ') >= 0) {
    text = text.replace(regexp10, ' #&gt;&gt; ');
  }
  if (text.indexOf(' @> ') >= 0) {
    text = text.replace(regexp11, ' @&gt; ');
  }
  if (text.indexOf(' >@ ') >= 0) {
    text = text.replace(regexp12, ' &gt;@ ');
  }
  if (text.indexOf(' <@ ') >= 0) {
    text = text.replace(regexp13, ' &lt;@ ');
  }
  if (text.indexOf(' @< ') >= 0) {
    text = text.replace(regexp14, ' @&lt; ');
  }
  if (text.indexOf('\r\n') >= 0) {
    text = text.replace(regexp30, '');
  }
  if (text.indexOf('\r') >= 0) {
    text = text.replace(regexp31, '');
  }
  if (text.indexOf('\n') >= 0) {
    text = text.replace(regexp32, '');
  }
  while (text.indexOf('    ') >= 0) {
    text = text.replace(regexp33, ' ');
  }
  while (text.indexOf('  ') >= 0) {
    text = text.replace(regexp34, ' ');
  }
  return text;
}
export function buildTemplateFromNodes(nodes: NodeListOf<ChildNode>): Template {
  const templates: TemplateNode[] = [];
  let text = '';
  const l = nodes.length;
  for (let i = 0; i < l; i++) {
    const c = nodes[i];
    if (c.nodeType === 3) {
      if (c.nodeValue != null) {
        const v = c.nodeValue;
        const format = buildFormat(v);
        const sub: TemplateNode = { type: TemplateType.text, text: v, property: '', value: '', format };
        templates.push(sub);
        text = text + sub.text;
      }
    } else if (c.nodeType === 1) {
      const child = c as Element;
      if (child.nodeName === 'if') {
        const test = child.getAttribute('test');
        if (test && test.length > 0) {
          const s2 = buildIf(test);
          if (s2) {
            const v = getString(child.firstChild);
            const format = buildFormat(v);
            const array  = child.getAttribute('array');
            const prefix = child.getAttribute('prefix');
            const suffix = child.getAttribute('suffix');
            const separator  = child.getAttribute('separator');
            const sub: TemplateNode = { type: s2.type, text: v, property: s2.property, value: s2.value, format, array, separator, prefix, suffix };
            templates.push(sub);
            text = text + child.toString();
          }
        }
      }
      if (isValidNode(child.nodeName)) {
        const property = child.getAttribute('property');
        const array  = child.getAttribute('array');
        const prefix = child.getAttribute('prefix');
        const suffix = child.getAttribute('suffix');
        const separator  = child.getAttribute('separator');
        const encode = child.getAttribute('encode');
        let value = child.getAttribute('value');
        if (!value) {
          value = child.getAttribute('compareValue');
        }
        const type = child.nodeName;
        const subText = getString(child.firstChild);
        const format = buildFormat(subText);
        const sub: TemplateNode = {property, encode, value, text: subText, type, format, array, separator, prefix, suffix};
        templates.push(sub);
        text = text + child.toString();
      }
    }
  }
  return { text, templates };
}
export interface IfTemplateNode {
  type: string;
  property: string | null;
  value: string | null;
}
export function buildIf(t: string): IfTemplateNode | undefined {
  let i = t.indexOf('!=');
  if (i > 0) {
    const s1 = t.substr(0, i).trim();
    const s2 = t.substr(i + 2).trim();
    if (s1.length > 0) {
      if (s2 === 'null') {
        return { type: 'isNotNull', property: s1, value: 'null' };
      } else {
        return { type: 'isNotEqual', property: s1, value: trimQ(s2) };
      }
    }
  } else {
    i = t.indexOf('==');
    if (i > 0) {
      const s1 = t.substr(0, i).trim();
      const s2 = t.substr(i + 2).trim();
      if (s1.length > 0) {
        if (s2 === 'null') {
          return { type: 'isNull', property: s1, value: 'null' };
        } else {
          return { type: 'isEqual', property: s1, value: trimQ(s2) };
        }
      }
    }
  }
  return undefined;
}
export function trimQ(s: string): string {
  // tslint:disable-next-line:quotemark
  if (s.startsWith("'")) {
    s = s.substr(1);
  }
  // tslint:disable-next-line:quotemark
  if (s.endsWith("'")) {
    s = s.substr(0, s.length - 1);
  }
  if (s.startsWith('"')) {
    s = s.substr(1);
  }
  if (s.endsWith('"')) {
    s = s.substr(0, s.length - 1);
  }
  return s;
}
function getString(s: ChildNode | null) {
  return s && s.textContent ? s.textContent : '';
}
const ns = ['isNotNull', 'isNull', 'isEqual', 'isNotEqual', 'isEmpty', 'isNotEmpty'];
function isValidNode(s: string) {
  for (const n of ns) {
    if (n === s) {
      return true;
    }
  }
  return false;
}
