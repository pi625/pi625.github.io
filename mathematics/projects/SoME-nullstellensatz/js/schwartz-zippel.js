/* Widget · How Much Can a Curve Catch? (Schwartz-Zippel)
 * Scatter N random points, drop a degree-d curve y = P(x) on top, and drag it
 * around. A low-degree curve can only touch a few points -- rigidity as scarcity.
 * Scoped to #schwartz-zippel.
 */
(function () {
  "use strict";
  var root = document.getElementById("schwartz-zippel");
  if (!root) return;

  var R = 3.2;              // data half-range
  var N = 50, d = 2;
  var pts = [], coef = [], hx = 0, hy = 0;

  var nEl = root.querySelector(".sz-n"), dEl = root.querySelector(".sz-d");
  var canvas = root.querySelector(".sz-canvas"), ctx = canvas.getContext("2d");
  var out = root.querySelector(".sz-out");

  nEl.addEventListener("input", function () { N = +nEl.value; rerollPts(); });
  dEl.addEventListener("input", function () { d = +dEl.value; rerollCurve(); render(); });
  root.querySelector(".sz-reroll").addEventListener("click", function () { rerollPts(); rerollCurve(); render(); });

  function rerollPts() { pts = []; for (var i = 0; i < N; i++) pts.push([(Math.random() * 2 - 1) * R, (Math.random() * 2 - 1) * R]); render(); }
  function rerollCurve() { coef = []; for (var k = 0; k <= d; k++) coef.push((Math.random() * 2 - 1)); }

  function curveY(x) { var t = (x - hx) / R, y = 0; for (var k = 0; k <= d; k++) y += coef[k] * Math.pow(t, k); return y * R + hy; }

  // drag to move the curve
  var dragging = false, lx = 0, ly = 0;
  function pos(e) { var t = e.touches ? e.touches[0] : e, r = canvas.getBoundingClientRect(); return { x: t.clientX - r.left, y: t.clientY - r.top }; }
  canvas.addEventListener("mousedown", function (e) { dragging = true; var q = pos(e); lx = q.x; ly = q.y; });
  window.addEventListener("mousemove", function (e) {
    if (!dragging) return; var q = pos(e), W = canvas.clientWidth || 600, H = 300, sc = Math.min(W, H) / (2 * R);
    hx += (q.x - lx) / sc; hy += (ly - q.y) / sc; lx = q.x; ly = q.y; render();
  });
  window.addEventListener("mouseup", function () { dragging = false; });
  canvas.addEventListener("touchstart", function (e) { dragging = true; var q = pos(e); lx = q.x; ly = q.y; e.preventDefault(); }, { passive: false });
  canvas.addEventListener("touchmove", function (e) { if (!dragging) return; var q = pos(e), W = canvas.clientWidth || 600, H = 300, sc = Math.min(W, H) / (2 * R); hx += (q.x - lx) / sc; hy += (ly - q.y) / sc; lx = q.x; ly = q.y; render(); e.preventDefault(); }, { passive: false });
  canvas.addEventListener("touchend", function () { dragging = false; });

  function cssVar(k, f) { var v = getComputedStyle(document.documentElement).getPropertyValue(k); return (v && v.trim()) || f; }

  function render() {
    var dpr = window.devicePixelRatio || 1, W = canvas.clientWidth || 600, H = 300;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    var cx = W / 2, cy = H / 2, sc = Math.min(W, H) / (2 * R);
    var hair = cssVar("--hairline", "rgba(27,42,68,.18)"), links = cssVar("--links", "#3f68cc"), text = cssVar("--text-secondary", "#74809a");
    function SX(x) { return cx + x * sc; } function SY(y) { return cy - y * sc; }

    ctx.strokeStyle = hair; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

    // the curve
    var tol = 0.14; // data-unit band
    ctx.strokeStyle = links; ctx.lineWidth = 2.5; ctx.beginPath();
    var first = true;
    for (var px = 0; px <= W; px += 2) {
      var xd = (px - cx) / sc, yd = curveY(xd), py = SY(yd);
      if (py < -1000 || py > H + 1000) { first = true; continue; }
      if (first) { ctx.moveTo(px, py); first = false; } else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // points, hits highlighted
    var hits = 0;
    pts.forEach(function (P) {
      var caught = Math.abs(P[1] - curveY(P[0])) < tol;
      if (caught) hits++;
      ctx.beginPath(); ctx.arc(SX(P[0]), SY(P[1]), caught ? 6 : 4, 0, 2 * Math.PI);
      ctx.fillStyle = caught ? "#e0556b" : cssVar("--glass-strong", "#889");
      ctx.globalAlpha = caught ? 1 : 0.8; ctx.fill(); ctx.globalAlpha = 1;
      ctx.lineWidth = 1; ctx.strokeStyle = hair; ctx.stroke();
    });

    out.innerHTML = "curve catches <b>" + hits + "</b> / " + N + " points · a degree-" + d +
      " curve can only touch a thin sliver — drag it and see you can't do much better.";
    out.style.color = text;
  }

  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  window.addEventListener("resize", render);
  rerollPts(); rerollCurve(); render();
})();
