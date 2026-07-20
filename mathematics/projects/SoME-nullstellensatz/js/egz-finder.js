/* Widget · Erdos-Ginzburg-Ziv Finder
 * Throw down 2p-1 integers; select p of them and track the running sum mod p, or
 * let the widget find the guaranteed p-subset summing to 0 mod p (DP). The subset
 * always exists -- that is the theorem. Scoped to #egz-finder.
 */
(function () {
  "use strict";
  var root = document.getElementById("egz-finder");
  if (!root) return;

  var PRIMES = [3, 5, 7];
  var p = 5, vals = [], sel = {};

  var pEl = root.querySelector(".egz-p"), chipsEl = root.querySelector(".egz-chips"), out = root.querySelector(".egz-out");
  PRIMES.forEach(function (q) { var o = document.createElement("option"); o.value = q; o.textContent = q; if (q === p) o.selected = true; pEl.appendChild(o); });
  pEl.addEventListener("change", function () { p = +pEl.value; reroll(); });
  root.querySelector(".egz-reroll").addEventListener("click", reroll);
  root.querySelector(".egz-solve").addEventListener("click", solve);

  function reroll() {
    vals = []; sel = {};
    for (var i = 0; i < 2 * p - 1; i++) vals.push(Math.floor(Math.random() * 20));
    render();
  }

  function solve() {
    // DP: reach exactly p items with residue 0 (mod p). dp[c][r] = {pr, item}
    var dp = []; for (var c = 0; c <= p; c++) { dp.push([]); for (var r = 0; r < p; r++) dp[c].push(null); }
    dp[0][0] = { pr: -1, item: -1 };
    for (var i = 0; i < vals.length; i++) {
      var v = ((vals[i] % p) + p) % p;
      for (var cc = Math.min(p - 1, i); cc >= 0; cc--) {
        for (var rr = 0; rr < p; rr++) {
          if (dp[cc][rr] && !dp[cc + 1][(rr + v) % p]) dp[cc + 1][(rr + v) % p] = { pr: rr, item: i };
        }
      }
    }
    sel = {};
    if (dp[p][0]) {
      var c = p, r = 0;
      while (c > 0) { var e = dp[c][r]; sel[e.item] = 1; r = e.pr; c--; }
    }
    render();
  }

  function render() {
    chipsEl.innerHTML = "";
    vals.forEach(function (v, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "egz-chip" + (sel[i] ? " is-on" : "");
      b.textContent = v;
      b.addEventListener("click", function () { if (sel[i]) delete sel[i]; else sel[i] = 1; render(); });
      chipsEl.appendChild(b);
    });
    var keys = Object.keys(sel), cnt = keys.length, sum = 0;
    keys.forEach(function (k) { sum += vals[k]; });
    var mod = ((sum % p) + p) % p;
    var solved = cnt === p && mod === 0;
    out.innerHTML = "selected <b>" + cnt + "</b> / " + p + " · sum = " + sum + " ≡ <b>" + mod + "</b> (mod " + p + ") · " +
      (solved ? "<span style='color:#2e9e5b'>found p numbers summing to 0 ✓</span>" :
        cnt === p ? "not zero yet — try others, or hit “find”" : "pick exactly " + p + " (there are " + (2 * p - 1) + " to choose from)");
  }

  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  reroll();
})();
