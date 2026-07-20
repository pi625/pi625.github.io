/* Widget · Vanishing Loci (Hilbert's Nullstellensatz)
 * Plots the real zero set V(f) = {f = 0} of a chosen polynomial in two variables,
 * illustrating the algebra <-> geometry dictionary. Scoped to #hilbert.
 */
(function () {
  "use strict";
  var root = document.getElementById("hilbert");
  if (!root) return;

  var CURVES = {
    circle:   { label: "x² + y² − 1", f: function (x, y) { return x * x + y * y - 1; } },
    parabola: { label: "y − x²",       f: function (x, y) { return y - x * x; } },
    two:      { label: "x² − y²  =  (x−y)(x+y)", f: function (x, y) { return x * x - y * y; } },
    cubic:    { label: "y² − x³ + x", f: function (x, y) { return y * y - x * x * x + x; } }
  };
  var key = "circle";
  var canvas = root.querySelector(".hb-canvas"), ctx = canvas.getContext("2d");

  root.querySelectorAll(".hb-ex").forEach(function (b) {
    b.addEventListener("click", function () {
      key = b.getAttribute("data-c");
      root.querySelectorAll(".hb-ex").forEach(function (o) { o.classList.toggle("is-on", o === b); });
      render();
    });
  });

  function cssVar(k, f) { var v = getComputedStyle(document.documentElement).getPropertyValue(k); return (v && v.trim()) || f; }

  function render() {
    var dpr = window.devicePixelRatio || 1, W = canvas.clientWidth || 600, H = 320;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    var R = 2.6, cx = W / 2, cy = H / 2, sc = Math.min(W, H) / (2 * R);
    var hair = cssVar("--hairline", "rgba(27,42,68,.2)"), text = cssVar("--text-secondary", "#74809a"), links = cssVar("--links", "#3f68cc");
    // axes
    ctx.strokeStyle = hair; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

    var f = CURVES[key].f, step = 2;
    // marching: draw pixels where f changes sign vs right/below neighbour
    ctx.fillStyle = links;
    for (var px = 0; px < W; px += step) for (var py = 0; py < H; py += step) {
      var X = (px - cx) / sc, Y = (cy - py) / sc;
      var v = f(X, Y);
      var vr = f((px + step - cx) / sc, Y), vd = f(X, (cy - (py + step)) / sc);
      if (v === 0 || v * vr < 0 || v * vd < 0) ctx.fillRect(px - 1, py - 1, 2.4, 2.4);
    }
    ctx.fillStyle = text; ctx.font = "13px 'Source Sans 3', sans-serif"; ctx.textAlign = "left";
    ctx.fillText("V(f):  f(x,y) = " + CURVES[key].label + "  = 0", 12, 20);
  }

  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  window.addEventListener("resize", render);
  render();
})();
