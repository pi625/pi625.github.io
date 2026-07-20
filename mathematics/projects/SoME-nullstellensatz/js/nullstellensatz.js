/* Widget · The Coefficient Detector
 * Expands f(x,y) = prod_{c in C}(x+y-c) with |C| = |A|+|B|-2, shows its 2D
 * coefficient table mod p, and highlights the monomial x^{|A|-1} y^{|B|-1} that the
 * Combinatorial Nullstellensatz reads. Because its exponents are below the grid
 * sizes, reduction mod the grid can never disturb it. Scoped to #null-coeff.
 */
(function () {
  "use strict";
  var root = document.getElementById("null-coeff");
  if (!root) return;

  var PRIMES = [3, 5, 7, 11, 13], p = 7, a = 3, b = 3;
  var pEl = root.querySelector(".nc-p"), aEl = root.querySelector(".nc-a"), bEl = root.querySelector(".nc-b"), out = root.querySelector(".nc-out");
  PRIMES.forEach(function (q) { var o = document.createElement("option"); o.value = q; o.textContent = q; if (q === p) o.selected = true; pEl.appendChild(o); });

  pEl.addEventListener("change", function () { p = +pEl.value; render(); });
  aEl.addEventListener("input", function () { a = +aEl.value; render(); });
  bEl.addEventListener("input", function () { b = +bEl.value; render(); });

  function mod(x) { return ((x % p) + p) % p; }

  function expand(C) {
    var poly = { "0,0": 1 };
    C.forEach(function (c) {
      var next = {};
      for (var key in poly) {
        var ij = key.split(","), i = +ij[0], j = +ij[1], v = poly[key];
        add(next, (i + 1) + "," + j, v);      // * x
        add(next, i + "," + (j + 1), v);      // * y
        add(next, i + "," + j, -c * v);       // * (-c)
      }
      poly = next;
    });
    return poly;
  }
  function add(o, k, v) { o[k] = (o[k] || 0) + v; }

  function render() {
    var deg = a + b - 2;
    var C = []; for (var c = 0; c < deg; c++) C.push(c);   // C = {0,...,a+b-3}, |C| = a+b-2
    var poly = expand(C);
    var ti = a - 1, tj = b - 1;

    var html = "f(x,y) = &prod;<sub>c=0</sub><sup>" + (deg - 1) + "</sup>(x + y &minus; c),&nbsp; |C| = " + deg + "<br><br>";
    html += "coefficients mod " + p + " &nbsp;(row = power of y, col = power of x):<br>";
    // table
    html += "<div style='margin-top:.4rem'>";
    for (var j = deg; j >= 0; j--) {
      var rowHas = false, row = "y<sup>" + j + "</sup> │ ";
      for (var i = 0; i <= deg; i++) {
        var v = poly[i + "," + j] || 0, m = mod(v);
        var cell = (i === ti && j === tj) ? "<span class='hit'>[" + m + "]</span>" : (v === 0 ? "&middot;" : "" + m);
        row += pad(cell, 6);
        if (v !== 0) rowHas = true;
      }
      if (rowHas || j <= deg) html += row + "<br>";
    }
    html += "&nbsp;&nbsp;&nbsp;└ " ;
    for (var i2 = 0; i2 <= deg; i2++) html += pad("x<sup>" + i2 + "</sup>", 6);
    html += "</div>";

    var target = mod(poly[ti + "," + tj] || 0);
    var binom = choose(deg, ti);
    html += "<br>coeff of <span class='hit'>x<sup>" + ti + "</sup>y<sup>" + tj + "</sup></span> = C(" + deg + "," + ti + ") = " +
      binom + " &equiv; <b>" + target + "</b> (mod " + p + ") &nbsp;→ " +
      (target !== 0 ? "non-zero ⇒ Nullstellensatz fires, a grid point with f≠0 exists." : "zero mod p (need |A|+|B|−2 < p for the clean proof).");
    html += "<br><span style='opacity:.75'>Reduction note: this monomial has x-power " + ti + " < |A|=" + a +
      " and y-power " + tj + " < |B|=" + b + ", so reducing mod ∏(x−s), ∏(y−s) never rewrites it — its coefficient is invariant.</span>";
    out.innerHTML = html;
  }
  function pad(s, n) { var plain = s.replace(/<[^>]+>/g, ""); var extra = n - plain.length; return s + (extra > 0 ? Array(extra + 1).join("&nbsp;") : "&nbsp;"); }
  function choose(nn, k) { if (k < 0 || k > nn) return 0; var r = 1; for (var i = 0; i < k; i++) r = r * (nn - i) / (i + 1); return Math.round(r); }

  render();
})();
