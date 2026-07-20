/* Widget · The Plane Placer (IMO 2007/6)
 * A rotatable {0..n}^3 lattice. Place axis planes x=k, y=k, z=k (each avoids the
 * origin) and cover every non-origin point. The minimum is 3n. Drag to rotate.
 * Scoped to #imo-planes.
 */
(function () {
  "use strict";
  var root = document.getElementById("imo-planes");
  if (!root) return;

  var n = 2, planes = [];             // {axis:'x'|'y'|'z', val:k}
  var yaw = 0.7, pitch = 0.5;
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
  var solveEl = root.querySelector(".ip-solve");
  if (solveEl) solveEl.addEventListener("click", function () {
    planes = [];
    for (var k = 1; k <= n; k++) { planes.push({ axis: "x", val: k }); planes.push({ axis: "y", val: k }); planes.push({ axis: "z", val: k }); }
    render();
  });

  // drag to rotate
  var dragging = false, lastX = 0, lastY = 0;
  function down(e) { dragging = true; var pt = point(e); lastX = pt.x; lastY = pt.y; e.preventDefault(); }
  function move(e) {
    if (!dragging) return;
    var pt = point(e);
    yaw += (pt.x - lastX) * 0.01; pitch += (pt.y - lastY) * 0.01;
    pitch = Math.max(-1.3, Math.min(1.3, pitch));
    lastX = pt.x; lastY = pt.y; render();
  }
  function up() { dragging = false; }
  function point(e) { var t = e.touches ? e.touches[0] : e; return { x: t.clientX, y: t.clientY }; }
  canvas.addEventListener("mousedown", down); window.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
  canvas.addEventListener("touchstart", down, { passive: false }); canvas.addEventListener("touchmove", function (e) { move(e); e.preventDefault(); }, { passive: false }); canvas.addEventListener("touchend", up);

  function fillVals() { valEl.innerHTML = ""; for (var k = 1; k <= n; k++) { var o = document.createElement("option"); o.value = k; o.textContent = k; valEl.appendChild(o); } }
  function covered(x, y, z) {
    return planes.some(function (p) { return (p.axis === "x" && x === p.val) || (p.axis === "y" && y === p.val) || (p.axis === "z" && z === p.val); });
  }
  function cssVar(k, f) { var v = getComputedStyle(document.documentElement).getPropertyValue(k); return (v && v.trim()) || f; }

  function render() {
    chips.innerHTML = "";
    planes.forEach(function (p) { var c = document.createElement("span"); c.className = "ip-chip"; c.textContent = p.axis + " = " + p.val; chips.appendChild(c); });

    var dpr = window.devicePixelRatio || 1, W = canvas.clientWidth || 600, H = 340;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    var scale = Math.min(W, H) / (n + 2) * 1.15, cx = W / 2, cyp = H / 2;
    var glass = cssVar("--glass-strong", "#ccc"), green = "#2e9e5b", red = "#e0556b";
    var hair = cssVar("--hairline", "rgba(27,42,68,.18)");

    function project(x, y, z) {
      var ax = x - n / 2, ay = y - n / 2, az = z - n / 2;
      var x1 = ax * Math.cos(yaw) - az * Math.sin(yaw);
      var z1 = ax * Math.sin(yaw) + az * Math.cos(yaw);
      var y2 = ay * Math.cos(pitch) - z1 * Math.sin(pitch);
      var z2 = ay * Math.sin(pitch) + z1 * Math.cos(pitch);
      return { x: cx + x1 * scale, y: cyp - y2 * scale, depth: z2 };
    }

    // cube edges for orientation
    var corners = [[0,0,0],[n,0,0],[0,n,0],[0,0,n],[n,n,0],[n,0,n],[0,n,n],[n,n,n]];
    var ce = corners.map(function (c) { return project(c[0], c[1], c[2]); });
    var eIdx = [[0,1],[0,2],[0,3],[1,4],[1,5],[2,4],[2,6],[3,5],[3,6],[4,7],[5,7],[6,7]];
    ctx.strokeStyle = hair; ctx.lineWidth = 1;
    eIdx.forEach(function (e) { ctx.beginPath(); ctx.moveTo(ce[e[0]].x, ce[e[0]].y); ctx.lineTo(ce[e[1]].x, ce[e[1]].y); ctx.stroke(); });

    var order = [];
    for (var x = 0; x <= n; x++) for (var y = 0; y <= n; y++) for (var z = 0; z <= n; z++) order.push([x, y, z]);
    var proj = order.map(function (P) { var pr = project(P[0], P[1], P[2]); return { P: P, pr: pr }; });
    proj.sort(function (a, b) { return a.pr.depth - b.pr.depth; });

    var total = 0, cov = 0;
    proj.forEach(function (o) {
      var x = o.P[0], y = o.P[1], z = o.P[2], sx = o.pr.x, sy = o.pr.y;
      var origin = (x === 0 && y === 0 && z === 0);
      if (!origin) { total++; if (covered(x, y, z)) cov++; }
      var col = origin ? red : covered(x, y, z) ? green : glass;
      var rad = origin ? 9 : 6 + (o.pr.depth) * 0.6;
      ctx.beginPath(); ctx.arc(sx, sy, Math.max(3, rad), 0, 2 * Math.PI);
      ctx.fillStyle = col; ctx.fill();
      ctx.strokeStyle = hair; ctx.lineWidth = 1; ctx.stroke();
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
