/* Widget · The Grid Vanisher (Alon-Furedi)
 * Click cells of an |A| x |B| grid to "vanish" them; leave exactly one alive.
 * The meter shows the forced minimum degree (|A|-1)+(|B|-1). Scoped to #grid-vanisher.
 */
(function () {
  "use strict";
  var root = document.getElementById("grid-vanisher");
  if (!root) return;

  var cols = 4, rows = 4;           // |A| = cols, |B| = rows
  var vanished = {};                // "r,c" -> true
  var alive = { r: 0, c: 0 };       // the single alive cell

  var colsEl = root.querySelector(".gv-cols"), rowsEl = root.querySelector(".gv-rows");
  var canvas = root.querySelector(".gv-canvas"), ctx = canvas.getContext("2d");
  var fill = root.querySelector(".gv-fill"), label = root.querySelector(".gv-label");
  var cells = [];

  colsEl.addEventListener("input", function () { cols = +colsEl.value; reset(); });
  rowsEl.addEventListener("input", function () { rows = +rowsEl.value; reset(); });
  canvas.addEventListener("click", function (e) {
    var r = canvas.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
    for (var i = 0; i < cells.length; i++) {
      var c = cells[i];
      if (mx >= c.x && mx <= c.x + c.s && my >= c.y && my <= c.y + c.s) {
        if (alive.r === c.row && alive.c === c.col) return;          // keep at least one alive
        var key = c.row + "," + c.col;
        if (vanished[key]) {                                         // revive -> becomes the alive one
          delete vanished[key]; markAliveElsewhere(); alive = { r: c.row, c: c.col };
        } else {                                                     // vanish this; move alive if needed
          vanished[key] = true;
        }
        render(); return;
      }
    }
  });

  function markAliveElsewhere() { vanished[alive.r + "," + alive.c] && delete vanished[alive.r + "," + alive.c]; }

  function reset() {
    vanished = {}; alive = { r: 0, c: 0 };
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) if (!(r === 0 && c === 0)) vanished[r + "," + c] = true;
    render();
  }

  function cssVar(k, f) { var v = getComputedStyle(document.documentElement).getPropertyValue(k); return (v && v.trim()) || f; }

  function render() {
    // ensure alive cell not vanished
    delete vanished[alive.r + "," + alive.c];
    var dpr = window.devicePixelRatio || 1, W = canvas.clientWidth || 600, H = 320;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    var pad = 30, gw = W - 2 * pad, gh = H - 2 * pad;
    var s = Math.min(gw / cols, gh / rows) * 0.86, gap = s * 0.14;
    var totalW = cols * (s + gap) - gap, totalH = rows * (s + gap) - gap;
    var ox = (W - totalW) / 2, oy = (H - totalH) / 2;
    var hair = cssVar("--hairline", "rgba(27,42,68,.2)"), text = cssVar("--text-secondary", "#74809a");
    var dark = cssVar("--headings", "#1b2a44"), gold = "#e0a83e", glass = cssVar("--glass-strong", "#fff");
    cells = [];
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
      var x = ox + c * (s + gap), y = oy + r * (s + gap);
      cells.push({ row: r, col: c, x: x, y: y, s: s });
      var isAlive = (alive.r === r && alive.c === c), isVan = !!vanished[r + "," + c] && !isAlive;
      ctx.fillStyle = isAlive ? gold : isVan ? dark : glass;
      ctx.strokeStyle = hair; ctx.lineWidth = 1;
      roundRect(x, y, s, s, 7); ctx.fill(); ctx.stroke();
      if (isAlive) { ctx.fillStyle = "#3a2a00"; ctx.font = "600 11px 'Source Sans 3',sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("≠0", x + s / 2, y + s / 2); }
    }
    var deg = (cols - 1) + (rows - 1);
    var pct = Math.min(100, deg / 14 * 100);
    fill.style.width = pct + "%";
    label.textContent = "min degree ≥ (" + cols + "−1)+(" + rows + "−1) = " + deg;
  }
  function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  window.addEventListener("resize", render);
  reset();
})();
