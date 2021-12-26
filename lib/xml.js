"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xmldom = require("xmldom");
var build_1 = require("./build");
function buildTemplate(parser, text, correct) {
  var s = (correct ? correct(text) : text);
  var d = parser.parseFromString('<template>' + s + '</template>', 'text/xml');
  return build_1.buildTemplateFromNodes(d.documentElement.childNodes);
}
exports.buildTemplate = buildTemplate;
function buildTemplates(streams, correct) {
  var DOMParser = xmldom.DOMParser;
  var parser = new DOMParser();
  var all = new Map();
  for (var _i = 0, streams_1 = streams; _i < streams_1.length; _i++) {
    var tmp = streams_1[_i];
    var stream = (correct ? correct(tmp) : tmp);
    var d = parser.parseFromString(stream, 'text/xml');
    var nodes = d.documentElement.childNodes;
    var l = nodes.length;
    for (var i = 0; i < l; i++) {
      var node = nodes[i];
      if (node.nodeType === 1) {
        var e = node;
        if (e.nodeName !== 'resultMap') {
          var id = e.getAttribute('id');
          var t = build_1.buildTemplateFromNodes(e.childNodes);
          if (id && t) {
            all.set(id, t);
          }
        }
      }
    }
  }
  return all;
}
exports.buildTemplates = buildTemplates;
