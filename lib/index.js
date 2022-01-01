"use strict";
function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("./core");
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
var Mapper = (function () {
  function Mapper(templates, db) {
    this.templates = templates;
    this.db = db;
    this.cacheFormats = new Map();
    this.getTemplate = this.getTemplate.bind(this);
    this.merge = this.merge.bind(this);
    this.exec = this.exec.bind(this);
    this.execBatch = this.execBatch.bind(this);
    this.query = this.query.bind(this);
    this.queryOne = this.queryOne.bind(this);
    this.execScalar = this.execScalar.bind(this);
    this.count = this.count.bind(this);
  }
  Mapper.prototype.getTemplate = function (id) {
    return this.templates.get(id);
  };
  Mapper.prototype.merge = function (key, obj) {
    var template = this.templates.get(key);
    if (!template) {
      return '';
    }
    return core_1.mergeSqlByTemplate(obj, template, this.cacheFormats);
  };
  Mapper.prototype.exec = function (key, obj, ctx) {
    var t = this.templates.get(key);
    if (t) {
      var s = core_1.buildSqlByTemplate(obj, t, this.cacheFormats, this.db.param);
      return this.db.exec(s.query, s.params, ctx);
    }
    else {
      return Promise.resolve(-1);
    }
  };
  Mapper.prototype.execBatch = function (keys, objs, firstSuccess, ctx) {
    if (keys.length !== objs.length) {
      return Promise.resolve(-3);
    }
    else {
      var ss = [];
      var l = keys.length;
      for (var i = 0; i < l; i++) {
        var key = keys[i];
        var obj = objs[i];
        var t = this.templates.get(key);
        if (!t) {
          return Promise.resolve(-2);
        }
        else {
          var s = core_1.buildSqlByTemplate(obj, t, this.cacheFormats, this.db.param);
          ss.push(s);
        }
      }
      return this.db.execBatch(ss, firstSuccess, ctx);
    }
  };
  Mapper.prototype.query = function (key, obj, m, bools, ctx) {
    var t = this.templates.get(key);
    if (t) {
      var s = core_1.buildSqlByTemplate(obj, t, this.cacheFormats, this.db.param);
      return this.db.query(s.query, s.params, m, bools, ctx);
    }
    else {
      return Promise.resolve([]);
    }
  };
  Mapper.prototype.queryOne = function (key, obj, m, bools, ctx) {
    var t = this.templates.get(key);
    if (t) {
      var s = core_1.buildSqlByTemplate(obj, t, this.cacheFormats, this.db.param);
      return this.db.queryOne(s.query, s.params, m, bools, ctx);
    }
    else {
      return Promise.resolve(null);
    }
  };
  Mapper.prototype.execScalar = function (key, obj, ctx) {
    var t = this.templates.get(key);
    if (t) {
      var s = core_1.buildSqlByTemplate(obj, t, this.cacheFormats, this.db.param);
      return this.db.execScalar(s.query, s.params, ctx);
    }
    else {
      throw new Error('Cannot find template with key ' + key);
    }
  };
  Mapper.prototype.count = function (key, obj, ctx) {
    var t = this.templates.get(key);
    if (t) {
      var s = core_1.buildSqlByTemplate(obj, t, this.cacheFormats, this.db.param);
      return this.db.count(s.query, s.params, ctx);
    }
    else {
      return Promise.resolve(-1);
    }
  };
  return Mapper;
}());
exports.Mapper = Mapper;
exports.TemplatesManager = Mapper;
function useTemplate(mapper) {
  if (!mapper) {
    return undefined;
  }
  var t = new TemplateManager();
  return t.build;
}
exports.useTemplate = useTemplate;
