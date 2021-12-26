"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("./core");
function correctXml(stream) {
  var regexp = new RegExp(' >= ', 'gi');
  var regexp2 = new RegExp(' <= ', 'gi');
  var regexp3 = new RegExp(' > ', 'gi');
  var regexp4 = new RegExp(' < ', 'gi');
  var text = stream;
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
exports.correctXml = correctXml;
function buildTemplateFromNodes(nodes) {
  var templates = [];
  var text = '';
  var l = nodes.length;
  for (var i = 0; i < l; i++) {
    var c = nodes[i];
    var sub = { type: '', text: '', property: '', value: '' };
    if (c.nodeType === 3) {
      if (c.nodeValue != null) {
        sub.type = core_1.TemplateType.text;
        sub.text = c.nodeValue;
        templates.push(sub);
        text = text + sub.text;
      }
    }
    else if (c.nodeType === 1) {
      var child = c;
      if (child.nodeName === 'if') {
        var test = child.getAttribute('test');
        if (test && test.length > 0) {
          var s2 = buildIf(test);
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
  return { text: text, templates: templates };
}
exports.buildTemplateFromNodes = buildTemplateFromNodes;
function buildIf(t) {
  var i = t.indexOf('!=');
  if (i > 0) {
    var s1 = t.substr(0, i).trim();
    var s2 = t.substr(i + 2).trim();
    if (s1.length > 0) {
      if (s2 === 'null') {
        return { type: 'isNotNull', text: '', property: s1, value: 'null' };
      }
      else {
        return { type: 'isNotEqual', text: '', property: s1, value: trim(s2) };
      }
    }
  }
  else {
    i = t.indexOf('==');
    if (i > 0) {
      var s1 = t.substr(0, i).trim();
      var s2 = t.substr(i + 2).trim();
      if (s1.length > 0) {
        if (s2 === 'null') {
          return { type: 'isNull', text: '', property: s1, value: 'null' };
        }
        else {
          return { type: 'isEqual', text: '', property: s1, value: trim(s2) };
        }
      }
    }
  }
  return undefined;
}
exports.buildIf = buildIf;
function trim(s) {
  if (s.startsWith("'")) {
    s = s.substr(1);
  }
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
exports.trim = trim;
function getString(s) {
  return s && s.textContent ? s.textContent : '';
}
var ns = ['isNotNull', 'isNull', 'isEqual', 'isNotEqual', 'isEmpty', 'isNotEmpty'];
function isValidNode(s) {
  for (var _i = 0, ns_1 = ns; _i < ns_1.length; _i++) {
    var n = ns_1[_i];
    if (n === s) {
      return true;
    }
  }
  return false;
}
