import * as xmldom from 'xmldom';
import { buildTemplateFromNodes } from './build';
import { Template } from './core';

export function buildTemplate(parser: DOMParser, text: string, correct?: (stream: string) => string): Template {
  const s = (correct ? correct(text) : text);
  const d = parser.parseFromString('<template>' + s + '</template>', 'text/xml');
  return buildTemplateFromNodes(d.documentElement.childNodes);
}
export function buildTemplates(streams: string[], correct?: (stream: string) => string): Map<string, Template> {
  const DOMParser = xmldom.DOMParser;
  const parser = new DOMParser();
  const all = new Map<string, Template>();
  for (const tmp of streams) {
    const stream = (correct ? correct(tmp) : tmp);
    const d = parser.parseFromString(stream, 'text/xml');
    const nodes = d.documentElement.childNodes;
    const l = nodes.length;
    for (let i = 0; i < l; i++) {
      const node = nodes[i];
      if (node.nodeType === 1) {
        const e = node as Element;
        if (e.nodeName !== 'resultMap') {
          const id = e.getAttribute('id');
          const t = buildTemplateFromNodes(e.childNodes);
          if (id && t) {
            all.set(id, t);
          }
        }
      }
    }
  }
  return all;
}
