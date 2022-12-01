// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/web-vitals/dist/web-vitals.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTTFB = exports.getLCP = exports.getFID = exports.getFCP = exports.getCLS = void 0;
var e,
  t,
  n,
  i,
  r = function (e, t) {
    return {
      name: e,
      value: void 0 === t ? -1 : t,
      delta: 0,
      entries: [],
      id: "v2-".concat(Date.now(), "-").concat(Math.floor(8999999999999 * Math.random()) + 1e12)
    };
  },
  a = function (e, t) {
    try {
      if (PerformanceObserver.supportedEntryTypes.includes(e)) {
        if ("first-input" === e && !("PerformanceEventTiming" in self)) return;
        var n = new PerformanceObserver(function (e) {
          return e.getEntries().map(t);
        });
        return n.observe({
          type: e,
          buffered: !0
        }), n;
      }
    } catch (e) {}
  },
  o = function (e, t) {
    var n = function n(i) {
      "pagehide" !== i.type && "hidden" !== document.visibilityState || (e(i), t && (removeEventListener("visibilitychange", n, !0), removeEventListener("pagehide", n, !0)));
    };
    addEventListener("visibilitychange", n, !0), addEventListener("pagehide", n, !0);
  },
  u = function (e) {
    addEventListener("pageshow", function (t) {
      t.persisted && e(t);
    }, !0);
  },
  c = function (e, t, n) {
    var i;
    return function (r) {
      t.value >= 0 && (r || n) && (t.delta = t.value - (i || 0), (t.delta || void 0 === i) && (i = t.value, e(t)));
    };
  },
  f = -1,
  s = function () {
    return "hidden" === document.visibilityState ? 0 : 1 / 0;
  },
  m = function () {
    o(function (e) {
      var t = e.timeStamp;
      f = t;
    }, !0);
  },
  v = function () {
    return f < 0 && (f = s(), m(), u(function () {
      setTimeout(function () {
        f = s(), m();
      }, 0);
    })), {
      get firstHiddenTime() {
        return f;
      }
    };
  },
  d = function (e, t) {
    var n,
      i = v(),
      o = r("FCP"),
      f = function (e) {
        "first-contentful-paint" === e.name && (m && m.disconnect(), e.startTime < i.firstHiddenTime && (o.value = e.startTime, o.entries.push(e), n(!0)));
      },
      s = window.performance && performance.getEntriesByName && performance.getEntriesByName("first-contentful-paint")[0],
      m = s ? null : a("paint", f);
    (s || m) && (n = c(e, o, t), s && f(s), u(function (i) {
      o = r("FCP"), n = c(e, o, t), requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          o.value = performance.now() - i.timeStamp, n(!0);
        });
      });
    }));
  },
  p = !1,
  l = -1,
  h = function (e, t) {
    p || (d(function (e) {
      l = e.value;
    }), p = !0);
    var n,
      i = function (t) {
        l > -1 && e(t);
      },
      f = r("CLS", 0),
      s = 0,
      m = [],
      v = function (e) {
        if (!e.hadRecentInput) {
          var t = m[0],
            i = m[m.length - 1];
          s && e.startTime - i.startTime < 1e3 && e.startTime - t.startTime < 5e3 ? (s += e.value, m.push(e)) : (s = e.value, m = [e]), s > f.value && (f.value = s, f.entries = m, n());
        }
      },
      h = a("layout-shift", v);
    h && (n = c(i, f, t), o(function () {
      h.takeRecords().map(v), n(!0);
    }), u(function () {
      s = 0, l = -1, f = r("CLS", 0), n = c(i, f, t);
    }));
  },
  T = {
    passive: !0,
    capture: !0
  },
  y = new Date(),
  g = function (i, r) {
    e || (e = r, t = i, n = new Date(), w(removeEventListener), E());
  },
  E = function () {
    if (t >= 0 && t < n - y) {
      var r = {
        entryType: "first-input",
        name: e.type,
        target: e.target,
        cancelable: e.cancelable,
        startTime: e.timeStamp,
        processingStart: e.timeStamp + t
      };
      i.forEach(function (e) {
        e(r);
      }), i = [];
    }
  },
  S = function (e) {
    if (e.cancelable) {
      var t = (e.timeStamp > 1e12 ? new Date() : performance.now()) - e.timeStamp;
      "pointerdown" == e.type ? function (e, t) {
        var n = function () {
            g(e, t), r();
          },
          i = function () {
            r();
          },
          r = function () {
            removeEventListener("pointerup", n, T), removeEventListener("pointercancel", i, T);
          };
        addEventListener("pointerup", n, T), addEventListener("pointercancel", i, T);
      }(t, e) : g(t, e);
    }
  },
  w = function (e) {
    ["mousedown", "keydown", "touchstart", "pointerdown"].forEach(function (t) {
      return e(t, S, T);
    });
  },
  L = function (n, f) {
    var s,
      m = v(),
      d = r("FID"),
      p = function (e) {
        e.startTime < m.firstHiddenTime && (d.value = e.processingStart - e.startTime, d.entries.push(e), s(!0));
      },
      l = a("first-input", p);
    s = c(n, d, f), l && o(function () {
      l.takeRecords().map(p), l.disconnect();
    }, !0), l && u(function () {
      var a;
      d = r("FID"), s = c(n, d, f), i = [], t = -1, e = null, w(addEventListener), a = p, i.push(a), E();
    });
  },
  b = {},
  F = function (e, t) {
    var n,
      i = v(),
      f = r("LCP"),
      s = function (e) {
        var t = e.startTime;
        t < i.firstHiddenTime && (f.value = t, f.entries.push(e), n());
      },
      m = a("largest-contentful-paint", s);
    if (m) {
      n = c(e, f, t);
      var d = function () {
        b[f.id] || (m.takeRecords().map(s), m.disconnect(), b[f.id] = !0, n(!0));
      };
      ["keydown", "click"].forEach(function (e) {
        addEventListener(e, d, {
          once: !0,
          capture: !0
        });
      }), o(d, !0), u(function (i) {
        f = r("LCP"), n = c(e, f, t), requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            f.value = performance.now() - i.timeStamp, b[f.id] = !0, n(!0);
          });
        });
      });
    }
  },
  P = function (e) {
    var t,
      n = r("TTFB");
    t = function () {
      try {
        var t = performance.getEntriesByType("navigation")[0] || function () {
          var e = performance.timing,
            t = {
              entryType: "navigation",
              startTime: 0
            };
          for (var n in e) "navigationStart" !== n && "toJSON" !== n && (t[n] = Math.max(e[n] - e.navigationStart, 0));
          return t;
        }();
        if (n.value = n.delta = t.responseStart, n.value < 0 || n.value > performance.now()) return;
        n.entries = [t], e(n);
      } catch (e) {}
    }, "complete" === document.readyState ? setTimeout(t, 0) : addEventListener("load", function () {
      return setTimeout(t, 0);
    });
  };
exports.getTTFB = P;
exports.getLCP = F;
exports.getFID = L;
exports.getCLS = h;
exports.getFCP = d;
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "65171" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../node_modules/web-vitals/dist/web-vitals.js"], null)
//# sourceMappingURL=/web-vitals.78b1c500.js.map