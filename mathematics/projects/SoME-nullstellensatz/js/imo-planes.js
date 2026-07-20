/* Widget · The Plane Placer (IMO 2007/6)
 * An isometric {0..n}^3 lattice. Place axis planes x=k, y=k, z=k (each avoids the
 * origin) and cover every non-origin point. The minimum is 3n. Scoped to #imo-planes.
 */
(function () {
  "use strict";
  var root = document.getElementById("imo-planes");
  if (!root) return;

  var n = 2, planes = [];             // {axis:'x'|'y'|'z', val:k}
  var nEl = root.querySelector(".ip-n"), axisEl = root.querySelector(".ip-axis"), valEl = root.querySelector(".ip-val");
  var stat = root.querySelector(".ip-stat"), chips = root.querySelector(".ip-planes");
  var canvas = root.querySelector(".ip-canvas"), ctx = canvas.getContext("2d");

  nEl.addEventListener("input", function () { n = +nEl.value; planes = []; fillVals(); render(); });
  root.querySelector(".ip-go").addEventListener("click", function () {
    var a = axisEl.value, v = +valEl.value;
    if (!planes.some(function (p) { return p.axis === a && p.val === v; })) planes.push({ axis: a, val: v });
    render();
  });
  root.querySelector(".ip-reset").addEventListener("click", function () { planes = []; render(); });

  function fillVals() { valEl.innerHTML = ""; for (var k = 1; k <= n; k++) { var o = document.createElement("option"); o.value = k; o.textContent = k; valEl.appendChild(o); } }

  function covered(x, y, z) {
    return planes.some(function (p) { return (p.axis === "x" && x === p.val) || (p.axis === "y" && y === p.val) || (p.axis === "z" && z === p.val); });
  }
  function cssVar(k, f) { var v = getComputedStyle(document.documentElement).getPropertyValue(k); return (v && v.trim()) || f; }

  function render() {
    chips.innerHTML = "";
    planes.forEach(function (p) { var c = document.createElement("span"); c.className = "ip-chip"; c.textContent = p.axis + " = " + p.val; chips.appendChild(c); });

    var dpr = window.devicePixelRatio || 1, W = canvas.clientWidth || 600, H = 320;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    var u = Math.min(W, H) / (n + 2) * 0.9, a = u * 0.87, b = u * 0.5;
    var cx = W / 2, cy = H / 2 + n * u * 0.25;
    var text = cssVar("--text-secondary", "#74809a"), glass = cssVar("--glass-strong", "#ccc");
    var green = "#2e9e5b", red = "#e0556b";

    var order = [];
    for (var x = 0; x <= n; x++) for (var y = 0; y <= n; y++) for (var z = 0; z <= n; z++) order.push([x, y, z]);
    order.sort(function (P, Q) { return (P[0] + P[1] + P[2]) - (Q[0] + Q[1] + Q[2]); });

    var total = 0, cov = 0;
    order.forEach(function (P) {
      var x = P[0], y = P[1], z = P[2];
      var sx = cx + (x - z) * a, sy = cy + (x + z) * b - y * u;
      var origin = (x === 0 && y === 0 && z === 0);
      if (!origin) { total++; if (covered(x, y, z)) cov++; }
      var col = origin ? red : covered(x, y, z) ? green : glass;
      ctx.beginPath(); ctx.arc(sx, sy, origin ? 8 : 6, 0, 2 * Math.PI);
      ctx.fillStyle = col; ctx.fill();
      ctx.strokeStyle = cssVar("--hairline", "rgba(27,42,68,.25)"); ctx.lineWidth = 1; ctx.stroke();
    });

    var need = 3 * n, done = cov === total;
    stat.innerHTML = "planes: <b>" + planes.length + "</b> / need " + need +
      " · covered " + cov + "/" + total + (done ? " — solved ✓" : "");
    stat.style.color = done && planes.length >= need ? "#2e9e5b" : "";
  }

  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  window.addEventListener("resize", render);
  fillVals(); render();
})();
