/* Widget · Counting Zeros mod p (Chevalley-Warning)
 * Enumerates every point of F_p^n for a preset low-degree system with sum(deg) < n,
 * colours the common zeros, and reports that the count is divisible by p.
 * Scoped to #chevalley-counter.
 */
(function () {
  "use strict";
  var root = document.getElementById("chevalley-counter");
  if (!root) return;

  var PRIMES = [2, 3, 5];
  var SYS = [
    { n: 2, deg: 1, label: "n=2:  f = x + 2y   (Σdeg 1)", f: function (c) { return [c[0] + 2 * c[1]]; } },
    { n: 3, deg: 2, label: "n=3:  f = x² + y + z   (Σdeg 2)", f: function (c) { return [c[0] * c[0] + c[1] + c[2]]; } },
    { n: 3, deg: 2, label: "n=3:  f = x² + y² − z   (Σdeg 2)", f: function (c) { return [c[0] * c[0] + c[1] * c[1] - c[2]]; } },
    { n: 3, deg: 2, label: "n=3:  f₁ = x,  f₂ = y   (Σdeg 2)", f: function (c) { return [c[0], c[1]]; } }
  ];
  var p = 3, si = 1;

  var pEl = root.querySelector(".cw-p"), sysEl = root.querySelector(".cw-sys");
  var canvas = root.querySelector(".cw-canvas"), ctx = canvas.getContext("2d");
  var verdict = root.querySelector(".cw-verdict");

  PRIMES.forEach(function (q) { var o = document.createElement("option"); o.value = q; o.textContent = q; if (q === p) o.selected = true; pEl.appendChild(o); });
  SYS.forEach(function (s, i) { var o = document.createElement("option"); o.value = i; o.textContent = s.label; if (i === si) o.selected = true; sysEl.appendChild(o); });
  pEl.addEventListener("change", function () { p = +pEl.value; render(); });
  sysEl.addEventListener("change", function () { si = +sysEl.value; render(); });

  function cssVar(k, f) { var v = getComputedStyle(document.documentElement).getPropertyValue(k); return (v && v.trim()) || f; }
  function mod(x) { return ((x % p) + p) % p; }

  function zeros() {
    var s = SYS[si], n = s.n, total = Math.pow(p, n), list = [];
    for (var i = 0; i < total; i++) {
      var c = [], x = i; for (var j = 0; j < n; j++) { c.push(x % p); x = Math.floor(x / p); }
      var vals = s.f(c), ok = true;
      for (var t = 0; t < vals.length; t++) if (mod(vals[t]) !== 0) { ok = false; break; }
      list.push({ c: c, zero: ok });
    }
    return list;
  }

  function render() {
    var s = SYS[si], n = s.n;
    var dpr = window.devicePixelRatio || 1, W = canvas.clientWidth || 600, H = 300;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    var glass = cssVar("--glass-strong", "#fff"), hair = cssVar("--hairline", "rgba(27,42,68,.25)"), green = "#2e9e5b", text = cssVar("--text-secondary", "#74809a");

    var pts = zeros(), count = 0;
    var layers = n === 2 ? 1 : p; // n=3 -> p layers by z
    var cell = Math.min((W - 30) / (p * layers + (layers - 1) * 0.6), (H - 60) / p);
    var blockW = p * cell, gap = cell * 0.6, totalW = layers * blockW + (layers - 1) * gap;
    var ox = (W - totalW) / 2, oy = (H - p * cell) / 2 + 8;

    pts.forEach(function (pt) {
      if (pt.zero) count++;
      var c = pt.c, layer = n === 3 ? c[2] : 0;
      var x = ox + layer * (blockW + gap) + c[0] * cell + cell / 2;
      var y = oy + c[1] * cell + cell / 2;
      ctx.beginPath(); ctx.arc(x, y, Math.min(13, cell * 0.36), 0, 2 * Math.PI);
      ctx.fillStyle = pt.zero ? green : glass; ctx.fill();
      ctx.lineWidth = 1; ctx.strokeStyle = hair; ctx.stroke();
    });
    if (n === 3) { ctx.fillStyle = text; ctx.font = "11px 'Roboto Mono',monospace"; ctx.textAlign = "center"; for (var L = 0; L < p; L++) ctx.fillText("z=" + L, ox + L * (blockW + gap) + blockW / 2, oy - 6); }

    verdict.innerHTML = "common zeros = <b>" + count + "</b> · " + count + " mod " + p + " = <b>" + (count % p) + "</b> ✓ &nbsp; (Σdeg = " + s.deg + " &lt; n = " + n + ", so p | count)";
  }

  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  window.addEventListener("resize", render);
  render();
})();
