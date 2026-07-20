/* Widget · Restricted Sumsets (Erdos-Heilbronn)
 * A Z_p clock for a single set A. Shows full A+A vs restricted A^+A (distinct
 * summands), each against its guaranteed lower bound. Scoped to #eh-explorer.
 */
(function () {
  "use strict";
  var root = document.getElementById("eh-explorer");
  if (!root) return;

  var PRIMES = [5, 7, 11, 13, 17], p = 11, A = {};
  var sel = root.querySelector(".eh-p");
  PRIMES.forEach(function (q) { var o = document.createElement("option"); o.value = q; o.textContent = q; if (q === p) o.selected = true; sel.appendChild(o); });
  var stat = root.querySelector(".eh-stat");
  var canvas = root.querySelector(".eh-canvas"), ctx = canvas.getContext("2d");
  var pts = [];

  sel.addEventListener("change", function () { p = +sel.value; A = {}; render(); });
  canvas.addEventListener("click", function (e) {
    var r = canvas.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top, best = -1, bd = 1e9;
    for (var i = 0; i < pts.length; i++) { var dx = mx - pts[i].x, dy = my - pts[i].y, d = dx * dx + dy * dy; if (d < bd) { bd = d; best = i; } }
    if (best >= 0 && bd < 900) { if (A[best]) delete A[best]; else A[best] = 1; render(); }
  });

  function sets() {
    var full = {}, restr = {}, ks = Object.keys(A).map(Number);
    for (var i = 0; i < ks.length; i++) for (var j = 0; j < ks.length; j++) {
      var s = (ks[i] + ks[j]) % p; full[s] = 1; if (ks[i] !== ks[j]) restr[s] = 1;
    }
    return { full: full, restr: restr };
  }
  function cssVar(n, f) { var v = getComputedStyle(document.documentElement).getPropertyValue(n); return (v && v.trim()) || f; }

  function render() {
    var dpr = window.devicePixelRatio || 1, W = canvas.clientWidth || 600, H = 360;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    var S = sets(), m = Object.keys(A).length;
    var cx = W / 2, cy = H / 2, R = Math.min(W, H) / 2 - 46;
    var text = cssVar("--text", "#3b475f"), hair = cssVar("--hairline", "rgba(27,42,68,.12)");
    var red = "#e0556b", green = "#2e9e5b", purple = "#8a4fd0";

    ctx.strokeStyle = hair; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.stroke();
    pts = [];
    for (var k = 0; k < p; k++) {
      var ang = -Math.PI / 2 + k * 2 * Math.PI / p, x = cx + R * Math.cos(ang), y = cy + R * Math.sin(ang);
      pts.push({ x: x, y: y });
      if (S.full[k]) { ctx.beginPath(); ctx.arc(x, y, 20, 0, 2 * Math.PI); ctx.strokeStyle = green; ctx.lineWidth = 3; ctx.stroke(); }
      if (S.restr[k]) { ctx.beginPath(); ctx.arc(x, y, 16, 0, 2 * Math.PI); ctx.strokeStyle = purple; ctx.lineWidth = 3; ctx.stroke(); }
      ctx.beginPath(); ctx.arc(x, y, 12, 0, 2 * Math.PI);
      ctx.fillStyle = A[k] ? red : cssVar("--glass-strong", "#fff"); ctx.fill();
      ctx.lineWidth = 1; ctx.strokeStyle = hair; ctx.stroke();
      ctx.fillStyle = A[k] ? "#fff" : text; ctx.font = "12px 'Roboto Mono', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(k, x, y);
    }
    if (m) {
      var bFull = Math.min(p, 2 * m - 1), bR = Math.min(p, 2 * m - 3);
      stat.innerHTML = "|A| = <b>" + m + "</b> · |A+A| = <b>" + Object.keys(S.full).length +
        "</b> (≥ " + bFull + ") · |A ⁺A| = <b>" + Object.keys(S.restr).length + "</b> (≥ " + Math.max(0, bR) + ")";
    } else { stat.textContent = "click to build A"; }
  }

  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  window.addEventListener("resize", render);
  render();
})();
