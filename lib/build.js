"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("./core");
var regexp = new RegExp(' >= ', 'gi');
var regexp2 = new RegExp(' <= ', 'gi');
var regexp3 = new RegExp(' > ', 'gi');
var regexp4 = new RegExp(' < ', 'gi');
var regexp5 = new RegExp(' && ', 'gi');
var regexp6 = new RegExp(' ?& ', 'gi');
var regexp7 = new RegExp(' -> ', 'gi');
var regexp8 = new RegExp(' ->> ', 'gi');
var regexp9 = new RegExp(' #> ', 'gi');
var regexp10 = new RegExp(' #>> ', 'gi');
var regexp11 = new RegExp(' @> ', 'gi');
var regexp12 = new RegExp(' >@ ', 'gi');
var regexp13 = new RegExp(' <@ ', 'gi');
var regexp14 = new RegExp(' @< ', 'gi');
var regexp30 = new RegExp('\r\n', 'gi');
var regexp31 = new RegExp('\r', 'gi');
var regexp32 = new RegExp('\n', 'gi');
var regexp33 = new RegExp('    ', 'gi');
var regexp34 = new RegExp('  ', 'gi');
function correctXml(stream) {
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
exports.correctXml = correctXml;
function trim(stream) {
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
exports.trim = trim;
function buildTemplateFromNodes(nodes) {
  var templates = [];
  var text = '';
  var l = nodes.length;
  for (var i = 0; i < l; i++) {
    var c = nodes[i];
    if (c.nodeType === 3) {
      if (c.nodeValue != null) {
        var v = c.nodeValue;
        var format = core_1.buildFormat(v);
        var sub = { type: core_1.TemplateType.text, text: v, property: '', value: '', format: format };
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
            var v = getString(child.firstChild);
            var format = core_1.buildFormat(v);
            var prefix = child.getAttribute('prefix');
            var suffix = child.getAttribute('suffix');
            var array = child.getAttribute('array');
            var sub = { type: s2.type, text: v, property: s2.property, value: s2.value, format: format, array: array, prefix: prefix, suffix: suffix };
            templates.push(sub);
            text = text + child.toString();
          }
        }
      }
      if (isValidNode(child.nodeName)) {
        var property = child.getAttribute('property');
        var prefix = child.getAttribute('prefix');
        var suffix = child.getAttribute('suffix');
        var array = child.getAttribute('array');
        var encode = child.getAttribute('encode');
        var value = child.getAttribute('value');
        if (!value) {
          value = child.getAttribute('compareValue');
        }
        var type = child.nodeName;
        var subText = getString(child.firstChild);
        var format = core_1.buildFormat(subText);
        var sub = { property: property, encode: encode, value: value, text: subText, type: type, format: format, array: array, prefix: prefix, suffix: suffix };
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
        return { type: 'isNotNull', property: s1, value: 'null' };
      }
      else {
        return { type: 'isNotEqual', property: s1, value: trimQ(s2) };
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
          return { type: 'isNull', property: s1, value: 'null' };
        }
        else {
          return { type: 'isEqual', property: s1, value: trimQ(s2) };
        }
      }
    }
  }
  return undefined;
}
exports.buildIf = buildIf;
function trimQ(s) {
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
exports.trimQ = trimQ;
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
