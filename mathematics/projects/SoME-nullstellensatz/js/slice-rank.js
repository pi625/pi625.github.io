/* Widget · The Exponential Gap (Slice Rank / Cap Sets)
 * Plots 3^n (the whole space) against the Ellenberg-Gijswijt bound 3*gamma^n on a
 * log scale, so the gap -- caps are an exponentially shrinking fraction (gamma/3)^n
 * -- is visible. Scoped to #slice-rank.
 */
(function () {
  "use strict";
  var root = document.getElementById("slice-rank");
  if (!root) return;

  var GAMMA = 2.7551, N = 25;
  var nEl = root.querySelector(".sr-n"), out = root.querySelector(".sr-out");
  var canvas = root.querySelector(".sr-canvas"), ctx = canvas.getContext("2d");

  nEl.addEventListener("input", function () { N = +nEl.value; render(); });

  function cssVar(k, f) { var v = getComputedStyle(document.documentElement).getPropertyValue(k); return (v && v.trim()) || f; }

  function render() {
    var dpr = window.devicePixelRatio || 1, W = canvas.clientWidth || 600, H = 320;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    var hair = cssVar("--hairline", "rgba(27,42,68,.2)"), text = cssVar("--text-secondary", "#74809a"), links = cssVar("--links", "#3f68cc");
    var padL = 46, padR = 14, padT = 16, padB = 26;
    var plotW = W - padL - padR, plotH = H - padT - padB;
    var maxLog = N * Math.log10(3) + 0.6; // top of log axis
    function X(n) { return padL + (n / N) * plotW; }
    function Y(logv) { return padT + plotH - (logv / maxLog) * plotH; }

    // gridlines (powers of 10)
    ctx.strokeStyle = hair; ctx.lineWidth = 1; ctx.fillStyle = text; ctx.font = "10px 'Roboto Mono',monospace"; ctx.textAlign = "right";
    for (var e = 0; e <= maxLog; e++) { var y = Y(e); ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke(); ctx.fillText("10" + sup(e), padL - 5, y + 3); }

    // fill gap between the two curves
    ctx.beginPath();
    for (var n = 0; n <= N; n++) ctx.lineTo(X(n), Y(n * Math.log10(3)));
    for (var m = N; m >= 0; m--) ctx.lineTo(X(m), Y(Math.log10(3) + m * Math.log10(GAMMA)));
    ctx.closePath(); ctx.fillStyle = "rgba(224,85,107,.14)"; ctx.fill();

    // 3^n
    ctx.strokeStyle = links; ctx.lineWidth = 2.5; ctx.beginPath();
    for (var i = 0; i <= N; i++) { var yy = Y(i * Math.log10(3)); (i === 0 ? ctx.moveTo : ctx.lineTo).call(ctx, X(i), yy); }
    ctx.stroke();

    // 3 * gamma^n
    ctx.strokeStyle = "#2e9e5b"; ctx.lineWidth = 2.5; ctx.beginPath();
    for (var j = 0; j <= N; j++) { var yg = Y(Math.log10(3) + j * Math.log10(GAMMA)); (j === 0 ? ctx.moveTo : ctx.lineTo).call(ctx, X(j), yg); }
    ctx.stroke();

    // labels + current-n markers
    ctx.textAlign = "left"; ctx.fillStyle = links; ctx.fillText("3ⁿ  (all of F₃ⁿ)", X(N * 0.02), Y(N * Math.log10(3)) - 6);
    ctx.fillStyle = "#2e9e5b"; ctx.fillText("3·γⁿ  (cap bound)", X(N * 0.35), Y(Math.log10(3) + N * Math.log10(GAMMA)) + 14);

    var full = Math.pow(3, N), bound = 3 * Math.pow(GAMMA, N), frac = bound / full;
    out.innerHTML = "n = <b>" + N + "</b> · |F₃ⁿ| = 3ⁿ = <b>" + fmt(full) + "</b> · cap bound 3·γⁿ ≈ <b>" + fmt(bound) +
      "</b> · " + (frac < 1
        ? "caps are ≤ <b>" + (frac * 100).toPrecision(3) + "%</b> of the space; that fraction is (γ/3)ⁿ → 0."
        : "bound still ≥ 100% here (it only bites once n ≥ 13) — slide n up to watch the gap open.");
    out.style.color = text;
  }

  function sup(k) { var s = "" + k, m = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" }, r = ""; for (var i = 0; i < s.length; i++) r += m[s[i]]; return r; }
  function fmt(x) { if (x < 1e6) return Math.round(x).toLocaleString(); return x.toExponential(2); }

  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  window.addEventListener("resize", render);
  render();
})();
