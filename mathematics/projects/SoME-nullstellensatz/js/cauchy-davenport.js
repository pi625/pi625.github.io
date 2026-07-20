/* Widget · The Cauchy-Davenport Demolisher
 * Pascal's triangle mod p, with the entry C(|A|+|B|-2, |A|-1) circled — the
 * coefficient the two-line proof depends on. Scoped to #cd-demolisher.
 */
(function () {
  "use strict";
  var root = document.getElementById("cd-demolisher");
  if (!root) return;

  var PRIMES = [2, 3, 5, 7, 11], p = 5, a = 3, b = 3;
  var pEl = root.querySelector(".cd-p"), aEl = root.querySelector(".cd-a"), bEl = root.querySelector(".cd-b");
  var tri = root.querySelector(".cd-tri"), out = root.querySelector(".cd-out");
  PRIMES.forEach(function (q) { var o = document.createElement("option"); o.value = q; o.textContent = q; if (q === p) o.selected = true; pEl.appendChild(o); });

  pEl.addEventListener("change", function () { p = +pEl.value; render(); });
  aEl.addEventListener("input", function () { a = +aEl.value; render(); });
  bEl.addEventListener("input", function () { b = +bEl.value; render(); });

  function mod(x) { return ((x % p) + p) % p; }

  function render() {
    var N = a + b - 2, pickRow = N, pickCol = a - 1;
    var rows = [[1]];
    for (var r = 1; r <= N; r++) {
      var prev = rows[r - 1], cur = [1];
      for (var k = 1; k < r; k++) cur.push(prev[k - 1] + prev[k]);
      cur.push(1); rows.push(cur);
    }
    var html = "";
    for (var i = 0; i <= N; i++) {
      var line = "";
      for (var j = 0; j <= i; j++) {
        var v = mod(rows[i][j]);
        var cls = "cell" + (v === 0 ? " zero" : "") + (i === pickRow && j === pickCol ? " pick" : "");
        line += "<span class='" + cls + "'>" + v + "</span>";
      }
      html += line + "<br>";
    }
    tri.innerHTML = html;

    var val = mod(rows[pickRow][pickCol]), intval = rows[pickRow][pickCol];
    out.innerHTML = "Need coeff of x<sup>" + (a - 1) + "</sup>y<sup>" + (b - 1) + "</sup> in (x+y)<sup>" + N + "</sup> = C(" + N + "," + (a - 1) + ") = " +
      intval + " &equiv; <b>" + val + "</b> (mod " + p + "). " +
      (val !== 0
        ? "Non-zero ⇒ |A+B| ≥ |A|+|B|−1 = " + (a + b - 1) + " holds. ✓"
        : "Zero mod p — this happens once |A|+|B|−2 ≥ p, where the min in the bound switches to p.");
  }

  render();
})();
