/* Widget · The Diagonal Hack & Catalan Coefficient
 * Visualizes coefficient extraction from (x-y)(x+y)^{2m-4}. The coefficient of
 * x^{m-1} y^{m-2} is C(2m-4,m-2) - C(2m-4,m-1) = Catalan(m-2). Scoped to #xy-hack.
 */
(function () {
  "use strict";
  var root = document.getElementById("xy-hack");
  if (!root) return;

  var PRIMES = [3, 5, 7, 11, 13, 17], p = 7, m = 4;
  var pEl = root.querySelector(".xy-p"), mEl = root.querySelector(".xy-m"), out = root.querySelector(".xy-out");
  var canvas = root.querySelector(".xy-canvas"), ctx = canvas.getContext("2d");
  PRIMES.forEach(function (q) { var o = document.createElement("option"); o.value = q; o.textContent = q; if (q === p) o.selected = true; pEl.appendChild(o); });

  pEl.addEventListener("change", function () { p = +pEl.value; render(); });
  mEl.addEventListener("input", function () { m = +mEl.value; render(); });

  function choose(n, k) { if (k < 0 || k > n) return 0; var r = 1; for (var i = 0; i < k; i++) r = r * (n - i) / (i + 1); return Math.round(r); }
  function mod(x) { return ((x % p) + p) % p; }
  function cssVar(k, f) { var v = getComputedStyle(document.documentElement).getPropertyValue(k); return (v && v.trim()) || f; }

  function render() {
    var N = 2 * m - 4;                                   // (x+y)^N
    var row = []; for (var k = 0; k <= N; k++) row.push(choose(N, k));
    var i1 = m - 2, i2 = m - 1;                          // the two binomials being subtracted
    var c1 = choose(N, i1), c2 = choose(N, i2);
    var catalan = c1 - c2;                               // = Catalan(m-2)

    // bar chart of the (x+y)^N row, marking the two contributing entries
    var dpr = window.devicePixelRatio || 1, W = canvas.clientWidth || 600, H = 320;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    var pad = 34, bw = (W - 2 * pad) / (N + 1), maxv = Math.max.apply(null, row) || 1;
    var text = cssVar("--text-secondary", "#74809a"), links = cssVar("--links", "#3f68cc");
    for (var k2 = 0; k2 <= N; k2++) {
      var h = (row[k2] / maxv) * (H - 2 * pad), x = pad + k2 * bw, y = H - pad - h;
      ctx.fillStyle = (k2 === i1) ? "#2e9e5b" : (k2 === i2) ? "#e0556b" : links;
      ctx.globalAlpha = (k2 === i1 || k2 === i2) ? 1 : 0.4;
      ctx.fillRect(x + bw * 0.12, y, bw * 0.76, h);
      ctx.globalAlpha = 1;
      ctx.fillStyle = text; ctx.font = "10px 'Roboto Mono', monospace"; ctx.textAlign = "center";
      ctx.fillText(row[k2], x + bw / 2, y - 4);
      ctx.fillText(k2, x + bw / 2, H - pad + 12);
    }
    ctx.fillStyle = text; ctx.textAlign = "left"; ctx.font = "12px 'Source Sans 3',sans-serif";
    ctx.fillText("(x+y)^" + N + " coefficients — green +C(" + N + "," + i1 + "), red −C(" + N + "," + i2 + ")", pad, 16);

    out.innerHTML = "coeff of x<sup>" + (m - 1) + "</sup>y<sup>" + (m - 2) + "</sup> in (x−y)(x+y)<sup>" + N + "</sup> = C(" + N + "," + i1 + ") − C(" + N + "," + i2 + ") = " +
      c1 + " − " + c2 + " = <b>" + catalan + "</b> = Catalan(" + (m - 2) + ") &equiv; <b>" + mod(catalan) + "</b> (mod " + p + "). " +
      (mod(catalan) !== 0
        ? "Non-zero ⇒ |A ⁺A| ≥ 2|A|−3 = " + (2 * m - 3) + ". ✓"
        : "Zero mod p — needs 2m−3 ≤ p for the argument.");
  }

  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  window.addEventListener("resize", render);
  render();
})();
