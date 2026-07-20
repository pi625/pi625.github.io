/* Widget · The Reduction, Step by Step (Combinatorial Nullstellensatz)
 * Expands f = prod_{c=0}^{a+b-2}(x+y-c) over F_p as a monomial grid, then reduces
 * it modulo the grid relations x^a = r_A(x), y^b = r_B(y) one monomial at a time.
 * Illegal monomials are pulled into the legal corner; the ringed top monomial
 * x^{a-1} y^{b-1} never leaves it. Scoped to #null-reduce.
 */
(function () {
  "use strict";
  var root = document.getElementById("null-reduce");
  if (!root) return;

  var PRIMES = [3, 5, 7, 11];
  var p = 7, a = 3, b = 3;
  var poly = {}, rA = [], rB = [];

  var pEl = root.querySelector(".nr-p"), aEl = root.querySelector(".nr-a"), bEl = root.querySelector(".nr-b");
  var canvas = root.querySelector(".nr-canvas"), ctx = canvas.getContext("2d"), out = root.querySelector(".nr-out");
  PRIMES.forEach(function (q) { var o = document.createElement("option"); o.value = q; o.textContent = q; if (q === p) o.selected = true; pEl.appendChild(o); });
  pEl.addEventListener("change", function () { p = +pEl.value; reset(); });
  aEl.addEventListener("input", function () { a = +aEl.value; reset(); });
  bEl.addEventListener("input", function () { b = +bEl.value; reset(); });
  root.querySelector(".nr-step").addEventListener("click", function () { step(); render(); });
  root.querySelector(".nr-reset").addEventListener("click", reset);

  function mod(x) { return ((x % p) + p) % p; }
  function add(o, kk, v) { o[kk] = mod((o[kk] || 0) + v); if (o[kk] === 0) delete o[kk]; }

  // 1D polynomial from roots 0..m-1 : returns coeff array (length m+1), monic
  function fromRoots(m) {
    var c = [1];
    for (var s = 0; s < m; s++) { var nc = new Array(c.length + 1).fill(0); for (var i = 0; i < c.length; i++) { nc[i] = mod(nc[i] - s * c[i]); nc[i + 1] = mod(nc[i + 1] + c[i]); } c = nc; }
    return c; // c[k] coeff of x^k
  }

  function reset() {
    // r_A: x^a = -(lower coeffs of g_A);  g_A = prod_{s=0}^{a-1}(x-s)
    var gA = fromRoots(a); rA = []; for (var i = 0; i < a; i++) rA.push(mod(-gA[i]));   // rA[t] = coeff of x^t in reduction of x^a
    var gB = fromRoots(b); rB = []; for (var j = 0; j < b; j++) rB.push(mod(-gB[j]));
    // f = prod_{c=0}^{a+b-3} (x + y - c)  (a+b-2 factors, so deg f = a+b-2)
    poly = {}; poly["0,0"] = 1;
    var nfac = a + b - 2;
    for (var cc = 0; cc < nfac; cc++) {
      var np = {};
      for (var kk in poly) {
        var ij = kk.split(",").map(Number), v = poly[kk];
        add(np, (ij[0] + 1) + "," + ij[1], v);            // * x
        add(np, ij[0] + "," + (ij[1] + 1), v);            // * y
        add(np, ij[0] + "," + ij[1], -cc * v);            // * (-c)
      }
      poly = np;
    }
    render();
  }

  // one reduction: pick the monomial of highest x-degree >= a (else highest y-degree >= b)
  function step() {
    var best = null, mode = null;
    for (var kk in poly) { var ij = kk.split(",").map(Number); if (ij[0] >= a) { if (!best || ij[0] > best[0] || (ij[0] === best[0] && ij[1] > best[1])) { best = ij; mode = "x"; } } }
    if (!best) { for (var k2 in poly) { var ij2 = k2.split(",").map(Number); if (ij2[1] >= b) { if (!best || ij2[1] > best[1] || (ij2[1] === best[1] && ij2[0] > best[0])) { best = ij2; mode = "y"; } } } }
    if (!best) return;
    var key = best[0] + "," + best[1], v = poly[key]; delete poly[key];
    if (mode === "x") { for (var t = 0; t < a; t++) if (rA[t]) add(poly, (best[0] - a + t) + "," + best[1], v * rA[t]); }
    else { for (var s = 0; s < b; s++) if (rB[s]) add(poly, best[0] + "," + (best[1] - b + s), v * rB[s]); }
  }

  function reduced() { for (var kk in poly) { var ij = kk.split(",").map(Number); if (ij[0] >= a || ij[1] >= b) return false; } return true; }

  function cssVar(k, f) { var v = getComputedStyle(document.documentElement).getPropertyValue(k); return (v && v.trim()) || f; }

  function render() {
    var dpr = window.devicePixelRatio || 1, W = canvas.clientWidth || 600, H = 320;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    var text = cssVar("--text-secondary", "#74809a"), hair = cssVar("--hairline", "rgba(27,42,68,.2)"), links = cssVar("--links", "#3f68cc");
    var maxI = a + b - 2, maxJ = a + b - 2;
    var pad = 34, gw = W - 2 * pad, gh = H - 2 * pad;
    var cell = Math.min(gw / (maxI + 1), gh / (maxJ + 1));
    var ox = pad, oy = H - pad;
    function px(i) { return ox + i * cell + cell / 2; }
    function py(j) { return oy - j * cell - cell / 2; }

    // legal region shading i<a, j<b
    ctx.fillStyle = "rgba(46,158,91,.12)";
    ctx.fillRect(ox, oy - b * cell, a * cell, b * cell);

    // axes ticks
    ctx.fillStyle = text; ctx.font = "10px 'Roboto Mono',monospace"; ctx.textAlign = "center";
    for (var i = 0; i <= maxI; i++) ctx.fillText("x" + supd(i), px(i), oy + 14);
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    for (var j = 0; j <= maxJ; j++) ctx.fillText("y" + supd(j), ox - 6, py(j));
    ctx.textBaseline = "alphabetic";

    // monomials
    for (var kk in poly) {
      var ij = kk.split(",").map(Number), legal = ij[0] < a && ij[1] < b;
      var top = ij[0] === a - 1 && ij[1] === b - 1;
      ctx.beginPath(); ctx.arc(px(ij[0]), py(ij[1]), Math.min(11, cell * 0.32), 0, 2 * Math.PI);
      ctx.fillStyle = legal ? links : "#e0a83e"; ctx.globalAlpha = 0.9; ctx.fill(); ctx.globalAlpha = 1;
      if (top) { ctx.beginPath(); ctx.arc(px(ij[0]), py(ij[1]), Math.min(15, cell * 0.44), 0, 2 * Math.PI); ctx.strokeStyle = "#e0556b"; ctx.lineWidth = 3; ctx.stroke(); }
    }

    var topKey = (a - 1) + "," + (b - 1), topCoeff = poly[topKey] || 0;
    var illegal = 0; for (var k3 in poly) { var ij3 = k3.split(",").map(Number); if (ij3[0] >= a || ij3[1] >= b) illegal++; }
    out.innerHTML = (reduced() ? "<b>fully reduced.</b> " : illegal + " illegal monomial(s) left. ") +
      "coeff of x" + supd(a - 1) + "y" + supd(b - 1) + " (ringed) = <b>" + topCoeff + "</b> mod " + p + " — unchanged by reduction. " +
      "It equals C(" + (a + b - 2) + ", " + (a - 1) + ") = " + binom(a + b - 2, a - 1) + " ≡ " + mod(binom(a + b - 2, a - 1)) + " (mod " + p + ").";
  }

  function supd(k) { var s = "" + k, m = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" }, r = ""; for (var i = 0; i < s.length; i++) r += m[s[i]]; return r; }
  function binom(n, k) { if (k < 0 || k > n) return 0; var r = 1; for (var i = 0; i < k; i++) r = r * (n - i) / (i + 1); return Math.round(r); }

  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  window.addEventListener("resize", render);
  reset();
})();
