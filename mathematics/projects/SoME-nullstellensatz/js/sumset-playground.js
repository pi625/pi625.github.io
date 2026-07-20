/* Widget · The Sumset Playground
 * A Z_p "clock": click residues to build sets A and B; A+B lights up. Shows the
 * Cauchy-Davenport target min(p, |A|+|B|-1) and whether the current sets meet it.
 * Vanilla JS, scoped to #sumset-playground.
 */
(function () {
  "use strict";
  var root = document.getElementById("sumset-playground");
  if (!root) return;

  var PRIMES = [5, 7, 11, 13, 17];
  var p = 7, active = "A";
  var A = {}, B = {};

  var sel = root.querySelector(".sp-prime");
  PRIMES.forEach(function (q) {
    var o = document.createElement("option");
    o.value = q; o.textContent = q; if (q === p) o.selected = true;
    sel.appendChild(o);
  });
  var tabs = root.querySelectorAll(".sp-tab");
  var elA = root.querySelector(".sp-a"), elB = root.querySelector(".sp-b"),
      elS = root.querySelector(".sp-s"), elBound = root.querySelector(".sp-bound");
  var canvas = root.querySelector(".sp-canvas"), ctx = canvas.getContext("2d");
  var linesEl = root.querySelector(".sp-lines");
  if (linesEl) linesEl.addEventListener("change", render);
  var pts = [];

  sel.addEventListener("change", function () { p = +sel.value; A = {}; B = {}; render(); });
  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      active = t.getAttribute("data-set");
      tabs.forEach(function (o) { o.classList.toggle("is-on", o === t); });
    });
  });
  root.querySelector(".sp-clear").addEventListener("click", function () { A = {}; B = {}; render(); });
  canvas.addEventListener("click", onClick);

  function onClick(e) {
    var r = canvas.getBoundingClientRect();
    var mx = e.clientX - r.left, my = e.clientY - r.top, best = -1, bd = 1e9;
    for (var i = 0; i < pts.length; i++) {
      var dx = mx - pts[i].x, dy = my - pts[i].y, d = dx * dx + dy * dy;
      if (d < bd) { bd = d; best = i; }
    }
    if (best >= 0 && bd < 900) {
      var set = active === "A" ? A : B;
      if (set[best]) delete set[best]; else set[best] = 1;
      render();
    }
  }

  function sumset() {
    var S = {}, ak = Object.keys(A), bk = Object.keys(B);
    for (var i = 0; i < ak.length; i++)
      for (var j = 0; j < bk.length; j++)
        S[(+ak[i] + +bk[j]) % p] = 1;
    return S;
  }

  function cssVar(n, f) { var v = getComputedStyle(document.documentElement).getPropertyValue(n); return (v && v.trim()) || f; }

  function render() {
    var dpr = window.devicePixelRatio || 1, W = canvas.clientWidth || 600, H = 360;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    var S = sumset(), na = Object.keys(A).length, nb = Object.keys(B).length, ns = Object.keys(S).length;
    var cx = W / 2, cy = H / 2, R = Math.min(W, H) / 2 - 46;
    var text = cssVar("--text", "#3b475f"), hair = cssVar("--hairline", "rgba(27,42,68,.12)");
    var red = "#e0556b", blue = "#3f68cc", green = "#2e9e5b";

    ctx.strokeStyle = hair; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.stroke();

    // node positions
    var pos = [];
    for (var q = 0; q < p; q++) {
      var a0 = -Math.PI / 2 + q * 2 * Math.PI / p;
      pos.push({ x: cx + R * Math.cos(a0), y: cy + R * Math.sin(a0) });
    }

    // sum chords: from each a in A and b in B, arc toward their sum a+b
    if (linesEl && linesEl.checked) {
      var ak = Object.keys(A), bk = Object.keys(B);
      ctx.lineWidth = 1;
      for (var ia = 0; ia < ak.length; ia++) for (var ib = 0; ib < bk.length; ib++) {
        var s = (+ak[ia] + +bk[ib]) % p;
        var src = pos[+ak[ia]], dst = pos[s];
        ctx.strokeStyle = "rgba(46,158,91,.28)";
        ctx.beginPath(); ctx.moveTo(src.x, src.y);
        ctx.quadraticCurveTo(cx, cy, dst.x, dst.y); ctx.stroke();
      }
    }

    pts = [];
    for (var k = 0; k < p; k++) {
      var x = pos[k].x, y = pos[k].y;
      pts.push({ x: x, y: y });
      if (S[k]) { ctx.beginPath(); ctx.arc(x, y, 17, 0, 2 * Math.PI); ctx.strokeStyle = green; ctx.lineWidth = 3; ctx.stroke(); }
      ctx.beginPath(); ctx.arc(x, y, 12, 0, 2 * Math.PI);
      ctx.fillStyle = A[k] ? red : cssVar("--glass-strong", "#fff"); ctx.fill();
      ctx.lineWidth = B[k] ? 3.5 : 1; ctx.strokeStyle = B[k] ? blue : hair; ctx.stroke();
      ctx.fillStyle = A[k] ? "#fff" : text; ctx.font = "12px 'Roboto Mono', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(k, x, y);
    }

    elA.textContent = na; elB.textContent = nb; elS.textContent = ns;
    if (na && nb) {
      var bound = Math.min(p, na + nb - 1);
      var meets = ns >= bound;
      elBound.innerHTML = "target min(p, |A|+|B|−1) = <b>" + bound + "</b> · " +
        (ns === bound ? "tight ✓" : meets ? "above bound ✓" : "BELOW — impossible");
      elBound.style.color = meets ? "" : "#d2465a";
    } else { elBound.textContent = ""; }
  }

  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  window.addEventListener("resize", render);
  render();
})();
