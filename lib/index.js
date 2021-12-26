"use strict";
function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("./core");
var xml_1 = require("./xml");
__export(require("./core"));
__export(require("./build"));
__export(require("./xml"));
__export(require("./search"));
var TemplateManager = (function () {
  function TemplateManager() {
    this.cacheFormats = new Map();
    this.merge = this.merge.bind(this);
  }
  TemplateManager.prototype.merge = function (template, obj) {
    return core_1.mergeSqlByTemplate(obj, template, this.cacheFormats);
  };
  TemplateManager.prototype.build = function (template, obj, param) {
    return core_1.buildSqlByTemplate(obj, template, this.cacheFormats, param);
  };
  return TemplateManager;
}());
exports.TemplateManager = TemplateManager;
var TemplatesManager = (function () {
  function TemplatesManager(streams, correct) {
    this.templates = xml_1.buildTemplates(streams, correct);
    this.cacheFormats = new Map();
    this.merge = this.merge.bind(this);
  }
  TemplatesManager.prototype.getTemplate = function (id) {
    return this.templates.get(id);
  };
  TemplatesManager.prototype.merge = function (key, obj) {
    var template = this.templates.get(key);
    if (!template) {
      return '';
    }
    return core_1.mergeSqlByTemplate(obj, template, this.cacheFormats);
  };
  return TemplatesManager;
}());
exports.TemplatesManager = TemplatesManager;
function useTemplate(mapper) {
  if (!mapper) {
    return undefined;
  }
  var t = new TemplateManager();
  return t.build;
}
exports.useTemplate = useTemplate;
