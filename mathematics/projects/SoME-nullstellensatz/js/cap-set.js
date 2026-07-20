/* Widget · The Cap Set Game
 * Build a subset of F_3^n (n = 2 or 3) with no line: no three distinct points
 * x,y,z with x+y+z = 0 (mod 3). Adding a point that completes a line is rejected
 * with a red flash. Max cap size is 4 (n=2) and 9 (n=3). Scoped to #cap-set.
 */
(function () {
  "use strict";
  var root = document.getElementById("cap-set");
  if (!root) return;

  var MAX = { 2: 4, 3: 9 };
  var n = 2, chosen = {}, flash = null;
  var nEl = root.querySelector(".cs-n"), stat = root.querySelector(".cs-stat"), out = root.querySelector(".cs-out");
  var canvas = root.querySelector(".cs-canvas"), ctx = canvas.getContext("2d");
  var spots = [];

  nEl.addEventListener("change", function () { n = +nEl.value; chosen = {}; flash = null; render(); });
  root.querySelector(".cs-clear").addEventListener("click", function () { chosen = {}; flash = null; render(); });
  canvas.addEventListener("click", function (e) {
    var r = canvas.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
    for (var i = 0; i < spots.length; i++) {
      var s = spots[i], dx = mx - s.x, dy = my - s.y;
      if (dx * dx + dy * dy < 18 * 18) { toggle(s.key); return; }
    }
  });

  function pts() { var list = [], total = Math.pow(3, n); for (var i = 0; i < total; i++) { var v = [], x = i; for (var j = 0; j < n; j++) { v.push(x % 3); x = Math.floor(x / 3); } list.push(v); } return list; }
  function keyOf(v) { return v.join(""); }
  function thirdPoint(a, b) { var c = []; for (var i = 0; i < n; i++) c.push(((3 - ((a[i] + b[i]) % 3)) % 3)); return c; }

  function toggle(kk) {
    if (chosen[kk]) { delete chosen[kk]; flash = null; render(); return; }
    // would adding kk complete a line with two chosen points?
    var keys = Object.keys(chosen), q = kk.split("").map(Number);
    for (var i = 0; i < keys.length; i++) for (var j = i + 1; j < keys.length; j++) {
      var a = keys[i].split("").map(Number), b = keys[j].split("").map(Number);
      if (keyOf(thirdPoint(a, b)) === kk) { flash = kk; render(); setTimeout(function () { if (flash === kk) { flash = null; render(); } }, 500); return; }
    }
    chosen[kk] = 1; flash = null; render();
  }

  function cssVar(k, f) { var v = getComputedStyle(document.documentElement).getPropertyValue(k); return (v && v.trim()) || f; }

  function render() {
    var dpr = window.devicePixelRatio || 1, W = canvas.clientWidth || 600, H = 320;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    var hair = cssVar("--hairline", "rgba(27,42,68,.25)"), text = cssVar("--text", "#3b475f"), glass = cssVar("--glass-strong", "#fff"), green = "#2e9e5b";
    spots = [];
    var layers = n === 2 ? 1 : 3;
    var cell = Math.min((W - 40) / (3 * layers + (layers - 1)), (H - 60) / 3);
    var blockW = 3 * cell, gap = cell, totalW = layers * blockW + (layers - 1) * gap;
    var ox = (W - totalW) / 2, oy = (H - 3 * cell) / 2 + 6;

    pts().forEach(function (v) {
      var layer = n === 3 ? v[2] : 0;
      var col = v[0], rowc = v[1];
      var x = ox + layer * (blockW + gap) + col * cell + cell / 2;
      var y = oy + rowc * cell + cell / 2;
      var kk = keyOf(v); spots.push({ x: x, y: y, key: kk });
      var isFlash = flash === kk;
      ctx.beginPath(); ctx.arc(x, y, Math.min(16, cell * 0.34), 0, 2 * Math.PI);
      ctx.fillStyle = isFlash ? "#e0556b" : chosen[kk] ? green : glass;
      ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = hair; ctx.stroke();
    });
    if (n === 3) { ctx.fillStyle = cssVar("--text-secondary", "#888"); ctx.font = "11px 'Roboto Mono',monospace"; ctx.textAlign = "center"; for (var L = 0; L < 3; L++) ctx.fillText("z=" + L, ox + L * (blockW + gap) + blockW / 2, oy - 6); }

    var size = Object.keys(chosen).length;
    stat.innerHTML = "cap size: <b>" + size + "</b> / max " + MAX[n];
    out.innerHTML = size >= MAX[n]
      ? "Maximum cap reached (" + MAX[n] + "). The Ellenberg–Gijswijt bound forces caps to be exponentially thin: ≤ 3·(2.7551…)<sup>n</sup> ≪ 3<sup>n</sup>."
      : "No line yet — every triple avoids x+y+z≡0. Keep going toward " + MAX[n] + ".";
  }

  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  window.addEventListener("resize", render);
  render();
})();
