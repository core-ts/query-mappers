"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reg = /'/gi;
var ParameterType;
(function (ParameterType) {
  ParameterType["text"] = "text";
  ParameterType["param"] = "param";
})(ParameterType = exports.ParameterType || (exports.ParameterType = {}));
var TemplateType;
(function (TemplateType) {
  TemplateType["text"] = "text";
  TemplateType["isNotNull"] = "isNotNull";
  TemplateType["isNull"] = "isNull";
  TemplateType["isEqual"] = "isEqual";
  TemplateType["isNotEqual"] = "isNotEqual";
  TemplateType["isEmpty"] = "isEmpty";
  TemplateType["isNotEmpty"] = "isNotEmpty";
})(TemplateType = exports.TemplateType || (exports.TemplateType = {}));
function buildFormat(str) {
  var texts = [];
  var parameters = [];
  var from = 0;
  var from2 = 0;
  var i = 0;
  var j = 0;
  while (true) {
    i = str.indexOf('{', from2);
    if (i >= 0) {
      j = str.indexOf('}', i + 1);
      if (j >= 0) {
        var pro = str.substring(i + 1, j);
        if (isValidProperty(pro)) {
          var name_1 = void 0;
          var type = void 0;
          name_1 = pro;
          if (i >= 1) {
            var chr = str[i - 1];
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
          }
          else {
            texts.push(str.substring(from, i));
            type = ParameterType.text;
          }
          var parameter = { name: name_1, type: type };
          parameters.push(parameter);
          from = j + 1;
          from2 = from;
        }
        else {
          from2 = j + 1;
        }
      }
      else {
        from = i + 1;
        from2 = from;
      }
    }
    else {
      texts.push(str.substring(from));
      break;
    }
  }
  var format = { texts: texts, parameters: parameters };
  return format;
}
exports.buildFormat = buildFormat;
function renderTemplateNodes(templateNodes, obj) {
  var nodes = [];
  for (var _i = 0, templateNodes_1 = templateNodes; _i < templateNodes_1.length; _i++) {
    var sub = templateNodes_1[_i];
    var attr = void 0;
    if (sub.property && sub.property.length > 0) {
      attr = valueOf(obj, sub.property);
    }
    var t = sub.type;
    if (t === TemplateType.text) {
      nodes.push(sub);
    }
    else if (t === TemplateType.isNotNull) {
      if (attr !== undefined && attr != null) {
        if (Array.isArray(attr)) {
          if (attr.length > 0) {
            nodes.push(sub);
          }
        }
        else {
          nodes.push(sub);
        }
      }
    }
    else if (t === TemplateType.isNull) {
      if (attr === undefined || attr == null || (Array.isArray(attr) && attr.length === 0)) {
        nodes.push(sub);
      }
    }
    else if (t === TemplateType.isEqual) {
      if (attr !== undefined && attr != null) {
        attr = '' + attr;
        if (attr === sub.value) {
          nodes.push(sub);
        }
      }
    }
    else if (t === TemplateType.isNotEqual) {
      if (attr !== undefined && attr != null) {
        attr = '' + attr;
        if (attr !== sub.value) {
          nodes.push(sub);
        }
      }
    }
    else if (t === TemplateType.isEmpty) {
      if (attr === '') {
        nodes.push(sub);
      }
    }
    else if (t === TemplateType.isNotEmpty) {
      if (attr !== '') {
        nodes.push(sub);
      }
    }
  }
  return nodes;
}
exports.renderTemplateNodes = renderTemplateNodes;
function mergeStringFormat(format, obj) {
  var results = [];
  var texts = format.texts;
  var parameters = format.parameters;
  var length = parameters.length;
  for (var i = 0; i < length; i++) {
    results.push(texts[i]);
    var p = obj[parameters[i].name];
    if (p && p.length > 0) {
      results.push(p);
    }
  }
  if (texts[length] && texts[length].length > 0) {
    results.push(texts[length]);
  }
  return results.join('');
}
exports.mergeStringFormat = mergeStringFormat;
function build(format, obj, j, param) {
  var results = [];
  var texts = format.texts;
  var parameters = format.parameters;
  var length = parameters.length;
  var k = j;
  var params = [];
  for (var i = 0; i < length; i++) {
    results.push(texts[i]);
    var p = valueOf(obj, parameters[i].name);
    if (p) {
      if (parameters[i].type === ParameterType.text) {
        results.push(p);
      }
      else {
        if (Array.isArray(p)) {
          if (p.length > 0) {
            var sa = [];
            for (var _i = 0, p_1 = p; _i < p_1.length; _i++) {
              var sp = p_1[_i];
              sa.push(param(k));
              params.push(sp);
              k = k + 1;
            }
            results.push(sa.join(','));
          }
        }
        else {
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
  return { query: results.join(''), params: params, i: k };
}
exports.build = build;
function isValidProperty(str) {
  for (var i = 0; i < str.length; i++) {
    var chr = str.charAt(i);
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
exports.isValidProperty = isValidProperty;
function getStringFormat(str, cacheFormats) {
  if (cacheFormats) {
    var format = cacheFormats.get(str);
    if (!format) {
      format = buildFormat(str);
      cacheFormats.set(str, format);
    }
    return format;
  }
  else {
    return buildFormat(str);
  }
}
exports.getStringFormat = getStringFormat;
function getText(str, templates) {
  var template = templates.get(str);
  return (!template ? '' : template.text);
}
exports.getText = getText;
function buildSqlByTemplate(obj, template, cacheFormats, param) {
  var results = [];
  var templateNodes = template.templates;
  var renderNodes = renderTemplateNodes(templateNodes, obj);
  var i = 1;
  var params = [];
  for (var _i = 0, renderNodes_1 = renderNodes; _i < renderNodes_1.length; _i++) {
    var sub = renderNodes_1[_i];
    var format = getStringFormat(sub.text, cacheFormats);
    var s = void 0;
    if (sub.type === TemplateType.text) {
      results.push(sub.text);
    }
    else {
      s = build(format, obj, i, param);
      i = s.i;
      if (s && s.query && s.query.length > 0) {
        results.push(s.query);
        if (s.params && s.params.length > 0) {
          for (var _a = 0, _b = s.params; _a < _b.length; _a++) {
            var p = _b[_a];
            params.push(p);
          }
        }
      }
    }
  }
  var query = results.join('');
  return { query: query, params: params };
}
exports.buildSqlByTemplate = buildSqlByTemplate;
function mergeSqlByTemplate(obj, template, cacheFormats) {
  var results = [];
  var templateNodes = template.templates;
  var renderNodes = renderTemplateNodes(templateNodes, obj);
  for (var _i = 0, renderNodes_2 = renderNodes; _i < renderNodes_2.length; _i++) {
    var sub = renderNodes_2[_i];
    var format = getStringFormat(sub.text, cacheFormats);
    var s = void 0;
    if (sub.type === TemplateType.text) {
      s = mergeSqlStringFormat(format, obj);
    }
    else {
      s = ('false' === sub.encode ? mergeStringFormat(format, obj) : mergeSqlStringFormat(format, obj));
    }
    if (s && s.length > 0) {
      results.push(s);
    }
  }
  return results.join('');
}
exports.mergeSqlByTemplate = mergeSqlByTemplate;
function mergeSqlStringFormat(format, obj) {
  var results = [];
  var texts = format.texts;
  var parameters = format.parameters;
  var length = parameters.length;
  for (var i = 0; i < length; i++) {
    results.push(texts[i]);
    var p = getSqlValue(obj[parameters[i].name]);
    if (p) {
      results.push(p);
    }
  }
  if (texts[length] && texts[length].length > 0) {
    results.push(texts[length]);
  }
  return results.join('');
}
exports.mergeSqlStringFormat = mergeSqlStringFormat;
function encodeSql(v) {
  return (v.indexOf("'") < 0 ? v : v.replace(reg, "''"));
}
exports.encodeSql = encodeSql;
function getSqlValue(obj) {
  if (typeof obj === 'string') {
    return encodeSql(obj);
  }
  else if (typeof obj === 'number') {
    return obj.toString();
  }
  else if (obj instanceof Date) {
    return obj.toISOString();
  }
  else {
    return encodeSql('' + obj);
  }
}
exports.getSqlValue = getSqlValue;
function getDirectValue(obj, key) {
  if (obj && obj.hasOwnProperty(key)) {
    return obj[key];
  }
  return null;
}
exports.getDirectValue = getDirectValue;
function valueOf(obj, key) {
  var mapper = key.split('.').map(function (item) {
    return item.replace(/\[/g, '.[').replace(/\[|\]/g, '');
  });
  var reSplit = mapper.join('.').split('.');
  return reSplit.reduce(function (acc, current, index, source) {
    var value = getDirectValue(acc, current);
    if (!value) {
      source.splice(1);
    }
    return value;
  }, obj);
}
exports.valueOf = valueOf;