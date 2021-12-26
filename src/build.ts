import { Template, TemplateNode, TemplateType } from './core';

export function correctXml(stream: string): string {
  const regexp = new RegExp(' >= ', 'gi');
  const regexp2 = new RegExp(' <= ', 'gi');
  const regexp3 = new RegExp(' > ', 'gi');
  const regexp4 = new RegExp(' < ', 'gi');
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
  return text;
}
export function buildTemplateFromNodes(nodes: NodeListOf<ChildNode>): Template {
  const templates: TemplateNode[] = [];
  let text = '';
  const l = nodes.length;
  for (let i = 0; i < l; i++) {
    const c = nodes[i];
    const sub: TemplateNode = { type: '', text: '', property: '', value: '' };
    if (c.nodeType === 3) {
      if (c.nodeValue != null) {
        sub.type = TemplateType.text;
        sub.text = c.nodeValue;
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
            s2.text = getString(child.firstChild);
            templates.push(s2);
            text = text + child.toString();
          }
        }
      }
      if (isValidNode(child.nodeName)) {
        sub.property = child.getAttribute('property');
        sub.encode = child.getAttribute('encode');
        sub.value = child.getAttribute('value');
        if (!sub.value) {
          sub.value = child.getAttribute('compareValue');
        }
        sub.type = child.nodeName;
        sub.text = getString(child.firstChild);
        templates.push(sub);
        text = text + child.toString();
      }
    }
  }
  return { text, templates };
}
export function buildIf(t: string): TemplateNode | undefined {
  let i = t.indexOf('!=');
  if (i > 0) {
    const s1 = t.substr(0, i).trim();
    let s2 = t.substr(i + 2).trim();
    if (s1.length > 0) {
      if (s2 === 'null') {
        return { type: 'isNotNull', text: '', property: s1, value: 'null' };
      } else {
        return { type: 'isNotEqual', text: '', property: s1, value: trim(s2) };
      }
    }
  } else {
    i = t.indexOf('==');
    if (i > 0) {
      const s1 = t.substr(0, i).trim();
      let s2 = t.substr(i + 2).trim();
      if (s1.length > 0) {
        if (s2 === 'null') {
          return { type: 'isNull', text: '', property: s1, value: 'null' };
        } else {
          return { type: 'isEqual', text: '', property: s1, value: trim(s2) };
        }
      }
    }
  }
  return undefined;
}
export function trim(s: string): string {
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
