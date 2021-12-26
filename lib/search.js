"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function useQuery(id, mapper, build, attrs, useContain, q, sort) {
  if (id && mapper && build) {
    var template = mapper.get(id);
    if (template) {
      var query = useQueryBuilder(template, build, attrs, useContain, q, sort);
      return query.buildQuery;
    }
  }
  return undefined;
}
exports.useQuery = useQuery;
function buildDollarParam(i) {
  return '$' + i;
}
exports.buildDollarParam = buildDollarParam;
function useQueryBuilder(template, build, attributes, useContain, q, sort) {
  return new QueryBuilder(template, build, useContain, undefined, attributes, q, sort);
}
exports.useQueryBuilder = useQueryBuilder;
var QueryBuilder = (function () {
  function QueryBuilder(template, build, useContain, bf, attributes, q, sort) {
    this.template = template;
    this.build = build;
    this.useContain = useContain;
    this.attributes = attributes;
    this.sort = (sort ? sort : 'sort');
    this.q = (q ? q : 'q');
    this.buildFilter = bf ? bf : buildFilter;
    this.buildQuery = this.buildQuery.bind(this);
  }
  QueryBuilder.prototype.buildQuery = function (filter, bparam, sn, buildSort, attrs) {
    var f2 = this.buildFilter(filter, this.q, this.useContain, this.attributes ? this.attributes : attrs);
    if (sn && sn.length > 0 && buildSort) {
      var sort = buildSort(sn);
      f2[this.sort] = sort;
    }
    var param1;
    if (typeof bparam === 'string') {
      param1 = buildDollarParam;
    }
    else {
      param1 = bparam;
    }
    return this.build(this.template, f2, param1);
  };
  return QueryBuilder;
}());
exports.QueryBuilder = QueryBuilder;
function buildFilter(filter, q, useContain, attrs) {
  var obj2 = {};
  var s = filter;
  var keys = Object.keys(s);
  for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
    var key = keys_1[_i];
    var v = s[key];
    if (v !== undefined && v != null && v !== '') {
      if (typeof v === 'string') {
        v = v.trim();
        if (v !== '') {
          if (key === q) {
            if (useContain) {
              obj2[key] = '%' + v + '%';
            }
            else {
              obj2[key] = v + '%';
            }
          }
          else {
            if (attrs) {
              var attr = attrs[key];
              if (attr) {
                if (attr.match === 'prefix') {
                  obj2[key] = '%' + v;
                }
                else if (attr.match === 'equal') {
                  obj2[key] = v;
                }
                else {
                  obj2[key] = '%' + v + '%';
                }
              }
              else {
                obj2[key] = v;
              }
            }
            else {
              obj2[key] = v;
            }
          }
        }
      }
      else {
        obj2[key] = v;
      }
    }
  }
  return obj2;
}
exports.buildFilter = buildFilter;
