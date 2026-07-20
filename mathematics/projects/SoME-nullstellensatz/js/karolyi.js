/* Widget · Sumsets in Z_n (Karolyi extension)
 * A Z_n clock (n possibly composite). Shows A+A vs the naive 2|A|-1 target and
 * the true guarantee governed by the smallest prime factor of n. Demonstrates how
 * subgroups defeat the field-only bound. Scoped to #karolyi.
 */
(function () {
  "use strict";
  var root = document.getElementById("karolyi");
  if (!root) return;

  var MODS = [6, 8, 9, 10, 12, 15], n = 12, A = {};
  var sel = root.querySelector(".ka-n");
  MODS.forEach(function (q) { var o = document.createElement("option"); o.value = q; o.textContent = q; if (q === n) o.selected = true; sel.appendChild(o); });
  var stat = root.querySelector(".ka-stat");
  var canvas = root.querySelector(".ka-canvas"), ctx = canvas.getContext("2d");
  var pts = [];

  function smallestPrime(x) { for (var d = 2; d * d <= x; d++) if (x % d === 0) return d; return x; }

  sel.addEventListener("change", function () { n = +sel.value; A = {}; render(); });
  canvas.addEventListener("click", function (e) {
    var r = canvas.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top, best = -1, bd = 1e9;
    for (var i = 0; i < pts.length; i++) { var dx = mx - pts[i].x, dy = my - pts[i].y, d = dx * dx + dy * dy; if (d < bd) { bd = d; best = i; } }
    if (best >= 0 && bd < 700) { if (A[best]) delete A[best]; else A[best] = 1; render(); }
  });

  function sumset() { var S = {}, ks = Object.keys(A).map(Number); for (var i = 0; i < ks.length; i++) for (var j = 0; j < ks.length; j++) S[(ks[i] + ks[j]) % n] = 1; return S; }
  function cssVar(k, f) { var v = getComputedStyle(document.documentElement).getPropertyValue(k); return (v && v.trim()) || f; }

  function render() {
    var dpr = window.devicePixelRatio || 1, W = canvas.clientWidth || 600, H = 360;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    var S = sumset(), m = Object.keys(A).length;
    var cx = W / 2, cy = H / 2, R = Math.min(W, H) / 2 - 44;
    var text = cssVar("--text", "#3b475f"), hair = cssVar("--hairline", "rgba(27,42,68,.12)"), red = "#e0556b", green = "#2e9e5b";
    ctx.strokeStyle = hair; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.stroke();
    pts = [];
    for (var k = 0; k < n; k++) {
      var ang = -Math.PI / 2 + k * 2 * Math.PI / n, x = cx + R * Math.cos(ang), y = cy + R * Math.sin(ang);
      pts.push({ x: x, y: y });
      if (S[k]) { ctx.beginPath(); ctx.arc(x, y, 16, 0, 2 * Math.PI); ctx.strokeStyle = green; ctx.lineWidth = 3; ctx.stroke(); }
      ctx.beginPath(); ctx.arc(x, y, 11, 0, 2 * Math.PI);
      ctx.fillStyle = A[k] ? red : cssVar("--glass-strong", "#fff"); ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = hair; ctx.stroke();
      ctx.fillStyle = A[k] ? "#fff" : text; ctx.font = "11px 'Roboto Mono', monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(k, x, y);
    }
    var sp = smallestPrime(n);
    if (m) {
      var naive = 2 * m - 1, guarantee = Math.min(n, Math.max(sp, 0)), got = Object.keys(S).length;
      var broke = got < naive;
      stat.innerHTML = "|A| = <b>" + m + "</b> · |A+A| = <b>" + got + "</b> · naive 2|A|−1 = " + naive +
        (broke ? " ✗ broken" : "") + " · smallest prime factor of n = <b>" + sp + "</b>";
      stat.style.color = broke ? "#d2465a" : "";
    } else { stat.innerHTML = "smallest prime factor of " + n + " is <b>" + sp + "</b> — click to build A"; stat.style.color = ""; }
  }

  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  window.addEventListener("resize", render);
  render();
})();
