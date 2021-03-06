(function() {
  var Transparency, elementMatcher, matchingElements, prepareContext, renderChildren, renderDirectives, renderValues, setText;

  jQuery.fn.render = function(objects, directives) {
    Transparency.render(this.get(), objects, directives);
    return this;
  };

  Transparency = this.Transparency = {};

  Transparency.render = function(contexts, objects, directives) {
    var context, i, n, object, parent, sibling, _i, _j, _len, _len2, _len3, _ref;
    contexts = contexts.length != null ? Array.prototype.slice.call(contexts, 0) : [contexts];
    if (!(objects instanceof Array)) objects = [objects];
    directives || (directives = {});
    for (_i = 0, _len = contexts.length; _i < _len; _i++) {
      context = contexts[_i];
      sibling = context.nextSibling;
      parent = context.parentNode;
      if (parent != null) parent.removeChild(context);
      prepareContext(context, objects);
      for (i = 0, _len2 = objects.length; i < _len2; i++) {
        object = objects[i];
        _ref = context.transparency.instances[i];
        for (_j = 0, _len3 = _ref.length; _j < _len3; _j++) {
          n = _ref[_j];
          context.transparency.fragment.appendChild(n);
        }
        renderValues(context.transparency.fragment, object);
        renderDirectives(context.transparency.fragment, object, directives);
        renderChildren(context.transparency.fragment, object, directives);
        context.appendChild(context.transparency.fragment);
      }
      if (sibling) {
        if (parent != null) parent.insertBefore(context, sibling);
      } else {
        if (parent != null) parent.appendChild(context);
      }
    }
    return contexts;
  };

  prepareContext = function(context, objects) {
    var n, template, _base, _base2, _base3, _base4, _results;
    context.transparency || (context.transparency = {});
    (_base = context.transparency).template || (_base.template = ((function() {
      var _results;
      _results = [];
      while (context.firstChild) {
        _results.push(context.removeChild(context.firstChild));
      }
      return _results;
    })()));
    (_base2 = context.transparency).templateCache || (_base2.templateCache = []);
    (_base3 = context.transparency).instances || (_base3.instances = []);
    (_base4 = context.transparency).fragment || (_base4.fragment = context.ownerDocument.createDocumentFragment());
    while (objects.length > context.transparency.instances.length) {
      template = context.transparency.templateCache.pop() || (map((function(n) {
        return n.cloneNode(true);
      }), context.transparency.template));
      context.transparency.instances.push(template);
    }
    _results = [];
    while (objects.length < context.transparency.instances.length) {
      _results.push(context.transparency.templateCache.push((function() {
        var _i, _len, _ref, _results2;
        _ref = context.transparency.instances.pop();
        _results2 = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          n = _ref[_i];
          _results2.push(context.removeChild(n));
        }
        return _results2;
      })()));
    }
    return _results;
  };

  renderValues = function(template, object) {
    var e, element, k, v, _results;
    if (typeof object === 'object') {
      _results = [];
      for (k in object) {
        v = object[k];
        if (typeof v !== 'object') {
          _results.push((function() {
            var _i, _len, _ref, _results2;
            _ref = matchingElements(template, k);
            _results2 = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              e = _ref[_i];
              _results2.push(setText(e, v));
            }
            return _results2;
          })());
        }
      }
      return _results;
    } else {
      element = matchingElements(template, 'listElement')[0] || jQuery(template).children()[0];
      if (element) return setText(element, object);
    }
  };

  renderDirectives = function(template, object, directives) {
    var attr, directive, e, key, v, _ref, _results;
    _results = [];
    for (key in directives) {
      directive = directives[key];
      if (!(typeof directive === 'function')) continue;
      _ref = key.split('@'), key = _ref[0], attr = _ref[1];
      _results.push((function() {
        var _i, _len, _ref2, _results2;
        _ref2 = matchingElements(template, key);
        _results2 = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          e = _ref2[_i];
          v = directive.call(object, e);
          if (attr) {
            _results2.push(e.setAttribute(attr, v));
          } else {
            _results2.push(setText(e, v));
          }
        }
        return _results2;
      })());
    }
    return _results;
  };

  renderChildren = function(template, object, directives) {
    var k, v, _results;
    _results = [];
    for (k in object) {
      v = object[k];
      if (typeof v === 'object') {
        _results.push(Transparency.render(matchingElements(template, k), v, directives[k]));
      }
    }
    return _results;
  };

  setText = function(e, text) {
    var children, _ref;
    if ((e != null ? (_ref = e.transparency) != null ? _ref.text : void 0 : void 0) === text) {
      return;
    }
    e.transparency || (e.transparency = {});
    e.transparency.text = text;
    e = jQuery(e);
    children = e.children().detach();
    e.text(text);
    return e.append(children);
  };

  matchingElements = function(template, key) {
    var firstChild, _base, _base2;
    if (!(firstChild = template.firstChild)) return [];
    firstChild.transparency || (firstChild.transparency = {});
    (_base = firstChild.transparency).queryCache || (_base.queryCache = {});
    return (_base2 = firstChild.transparency.queryCache)[key] || (_base2[key] = template.querySelectorAll ? template.querySelectorAll("#" + key + ", " + key + ", ." + key + ", [data-bind='" + key + "']") : filter(elementMatcher(key), template.getElementsByTagName('*')));
  };

  elementMatcher = function(key) {
    return function(element) {
      return element.className.indexOf(key) > -1 || element.id === key || element.tagName.toLowerCase() === key.toLowerCase() || element.getAttribute('data-bind') === key;
    };
  };

  if (typeof map === "undefined" || map === null) {
    map = function(f, xs) {
      var x, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = xs.length; _i < _len; _i++) {
        x = xs[_i];
        _results.push(f(x));
      }
      return _results;
    };
  }

  if (typeof filter === "undefined" || filter === null) {
    filter = function(p, xs) {
      var x, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = xs.length; _i < _len; _i++) {
        x = xs[_i];
        if (p(x)) _results.push(x);
      }
      return _results;
    };
  }

}).call(this);
