/* Widget · List Coloring & the Graph Polynomial (Alon-Tarsi)
 * Pick a small graph; each vertex gets a random size-k list. Click a vertex to
 * cycle its colour through its list; make every edge non-monochromatic. The
 * readout computes the graph-polynomial coefficient of prod x_i^{k-1}, whose
 * non-vanishing is exactly the Combinatorial Nullstellensatz guarantee.
 * Scoped to #alon-tarsi.
 */
(function () {
  "use strict";
  var root = document.getElementById("alon-tarsi");
  if (!root) return;

  var PALETTE = ["#e0556b", "#3f68cc", "#2e9e5b", "#e0a83e", "#8a4fd0", "#37b3c4"];
  var GRAPHS = {
    c4:   { n: 4, edges: [[0,1],[1,2],[2,3],[0,3]], pos: [[0.3,0.28],[0.7,0.28],[0.7,0.72],[0.3,0.72]] },
    k4:   { n: 4, edges: [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]], pos: [[0.5,0.2],[0.2,0.55],[0.8,0.55],[0.5,0.82]] },
    path: { n: 4, edges: [[0,1],[1,2],[2,3]], pos: [[0.18,0.5],[0.4,0.5],[0.6,0.5],[0.82,0.5]] },
    bull: { n: 5, edges: [[0,1],[1,2],[0,2],[0,3],[1,4]], pos: [[0.38,0.6],[0.62,0.6],[0.5,0.82],[0.16,0.32],[0.84,0.32]] }
  };
  var gkey = "c4", k = 2, lists = [], color = [];
  var kEl = root.querySelector(".at-k"), out = root.querySelector(".at-out");
  var canvas = root.querySelector(".at-canvas"), ctx = canvas.getContext("2d");
  var nodes = [];

  root.querySelectorAll(".at-ex").forEach(function (btn) {
    btn.addEventListener("click", function () {
      gkey = btn.getAttribute("data-g");
      root.querySelectorAll(".at-ex").forEach(function (o) { o.classList.toggle("is-on", o === btn); });
      newLists();
    });
  });
  root.querySelector(".at-ex").classList.add("is-on");
  kEl.addEventListener("input", function () { k = +kEl.value; newLists(); });
  var shuffleEl = root.querySelector(".at-shuffle");
  if (shuffleEl) shuffleEl.addEventListener("click", newLists);
  canvas.addEventListener("click", function (e) {
    var r = canvas.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
    for (var i = 0; i < nodes.length; i++) { var dx = mx - nodes[i].x, dy = my - nodes[i].y; if (dx * dx + dy * dy < 24 * 24) { cycle(i); return; } }
  });

  function newLists() {
    var g = GRAPHS[gkey]; lists = []; color = [];
    for (var i = 0; i < g.n; i++) {
      var pool = PALETTE.slice(), L = [];
      for (var j = 0; j < k; j++) L.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
      lists.push(L); color.push(L[0]);
    }
    render();
  }
  function cycle(i) { var L = lists[i], idx = (L.indexOf(color[i]) + 1) % L.length; color[i] = L[idx]; render(); }

  // multivariate expansion of prod_{(i,j) edge, i<j} (x_i - x_j)
  function coeffUniform(g, e) {
    var poly = {}; poly[key(g.n)] = 1;                      // start with constant 1
    g.edges.forEach(function (ed) {
      var np = {};
      for (var kk in poly) {
        var exp = kk.split(",").map(Number), v = poly[kk];
        var a = exp.slice(); a[ed[0]]++; addto(np, a.join(","), v);
        var b = exp.slice(); b[ed[1]]++; addto(np, b.join(","), -v);
      }
      poly = np;
    });
    var tgt = []; for (var i = 0; i < g.n; i++) tgt.push(e); 
    return poly[tgt.join(",")] || 0;
  }
  function key(n) { var a = []; for (var i = 0; i < n; i++) a.push(0); return a.join(","); }
  function addto(o, kk, v) { o[kk] = (o[kk] || 0) + v; }

  function cssVar(kk, f) { var v = getComputedStyle(document.documentElement).getPropertyValue(kk); return (v && v.trim()) || f; }

  function render() {
    var g = GRAPHS[gkey];
    var dpr = window.devicePixelRatio || 1, W = canvas.clientWidth || 600, H = 320;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    var hair = cssVar("--hairline", "rgba(27,42,68,.25)"), text = cssVar("--text", "#3b475f");
    nodes = g.pos.map(function (p) { return { x: p[0] * W, y: p[1] * H }; });
    var bad = 0;
    g.edges.forEach(function (ed) {
      var mono = color[ed[0]] === color[ed[1]]; if (mono) bad++;
      ctx.strokeStyle = mono ? "#e0556b" : hair; ctx.lineWidth = mono ? 4 : 2;
      ctx.beginPath(); ctx.moveTo(nodes[ed[0]].x, nodes[ed[0]].y); ctx.lineTo(nodes[ed[1]].x, nodes[ed[1]].y); ctx.stroke();
    });
    nodes.forEach(function (nd, i) {
      // list swatches
      lists[i].forEach(function (col, j) {
        ctx.fillStyle = col; ctx.globalAlpha = col === color[i] ? 1 : 0.35;
        ctx.fillRect(nd.x - 8 + j * 9, nd.y - 40, 8, 8); ctx.globalAlpha = 1;
      });
      ctx.beginPath(); ctx.arc(nd.x, nd.y, 20, 0, 2 * Math.PI); ctx.fillStyle = color[i]; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = "#fff"; ctx.stroke();
    });

    var e = k - 1, coeff = coeffUniform(g, e), sumExp = g.n * e, needDeg = g.edges.length;
    var applies = (coeff !== 0) && (sumExp === needDeg);
    out.innerHTML = (bad === 0 ? "Proper list-colouring found ✓ · " : bad + " monochromatic edge(s) · ") +
      "coeff of ∏x<sub>i</sub><sup>" + e + "</sup> in the graph polynomial = <b>" + coeff + "</b>" +
      (sumExp === needDeg
        ? (coeff !== 0 ? " ≠ 0 ⇒ Alon–Tarsi guarantees " + k + "-choosability." : " = 0 (this monomial can't certify " + k + "-choosability).")
        : " (degree ∑=" + sumExp + " ≠ |E|=" + needDeg + ", so k=" + k + " isn't the Alon–Tarsi target here).");
  }

  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  window.addEventListener("resize", render);
  newLists();
})();
