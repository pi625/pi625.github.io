/* Widget · Vanishing Loci (Hilbert's Nullstellensatz)
 * Plots the real zero set V(f) = {f = 0} of a chosen polynomial in two variables
 * and shades the regions f>0 / f<0, so the curve reads as the boundary between
 * them. Scoped to #hilbert.
 */
(function () {
  "use strict";
  var root = document.getElementById("hilbert");
  if (!root) return;

  var CURVES = {
    circle:     { label: "x² + y² − 1", f: function (x, y) { return x * x + y * y - 1; } },
    parabola:   { label: "y − x²", f: function (x, y) { return y - x * x; } },
    two:        { label: "x² − y²  =  (x−y)(x+y)", f: function (x, y) { return x * x - y * y; } },
    cubic:      { label: "y² − x³ + x", f: function (x, y) { return y * y - x * x * x + x; } },
    lemniscate: { label: "(x²+y²)² − 2(x²−y²)", f: function (x, y) { var r2 = x * x + y * y; return r2 * r2 - 2 * (x * x - y * y); } }
  };
  var key = "circle", shade = true;
  var canvas = root.querySelector(".hb-canvas"), ctx = canvas.getContext("2d");
  var shadeEl = root.querySelector(".hb-sign");

  root.querySelectorAll(".hb-ex").forEach(function (b) {
    b.addEventListener("click", function () {
      key = b.getAttribute("data-c");
      root.querySelectorAll(".hb-ex").forEach(function (o) { o.classList.toggle("is-on", o === b); });
      render();
    });
  });
  if (shadeEl) shadeEl.addEventListener("change", function () { shade = shadeEl.checked; render(); });

  function cssVar(k, f) { var v = getComputedStyle(document.documentElement).getPropertyValue(k); return (v && v.trim()) || f; }

  function render() {
    var dpr = window.devicePixelRatio || 1, W = canvas.clientWidth || 600, H = 340;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    var R = 2.6, cx = W / 2, cy = H / 2, sc = Math.min(W, H) / (2 * R);
    var hair = cssVar("--hairline", "rgba(27,42,68,.2)"), text = cssVar("--text-secondary", "#74809a"), links = cssVar("--links", "#3f68cc");
    var f = CURVES[key].f, step = 3;

    // sign shading
    if (shade) {
      for (var px = 0; px < W; px += step) for (var py = 0; py < H; py += step) {
        var X = (px - cx) / sc, Y = (cy - py) / sc, v = f(X, Y);
        ctx.fillStyle = v < 0 ? "rgba(63,104,204,.13)" : "rgba(224,140,62,.13)";
        ctx.fillRect(px, py, step, step);
      }
    }

    // axes
    ctx.strokeStyle = hair; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

    // the curve: pixels where f changes sign vs right/below neighbour
    var cs = 2;
    ctx.fillStyle = links;
    for (var qx = 0; qx < W; qx += cs) for (var qy = 0; qy < H; qy += cs) {
      var xx = (qx - cx) / sc, yy = (cy - qy) / sc;
      var vv = f(xx, yy);
      var vr = f((qx + cs - cx) / sc, yy), vd = f(xx, (cy - (qy + cs)) / sc);
      if (vv === 0 || vv * vr < 0 || vv * vd < 0) ctx.fillRect(qx - 1, qy - 1, 2.6, 2.6);
    }

    ctx.fillStyle = text; ctx.font = "13px 'Source Sans 3', sans-serif"; ctx.textAlign = "left";
    ctx.fillText("V(f):  f(x,y) = " + CURVES[key].label + "  = 0", 12, 20);
    if (shade) { ctx.fillText("blue: f<0    warm: f>0", 12, H - 12); }
  }

  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  window.addEventListener("resize", render);
  render();
})();
