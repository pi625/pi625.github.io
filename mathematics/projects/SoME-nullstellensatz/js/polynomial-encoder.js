/*
 * Widget 2 — The Polynomial Encoder
 * ---------------------------------
 * Click a number line to add elements to a set A. The widget builds the encoding
 * polynomial P_A(x) = prod (x - a_i), renders its LaTeX (factored + expanded),
 * and plots it. A "target degree d" slider demonstrates the univariate hammer:
 * once A has more than d elements, a degree-d polynomial with that many roots is
 * forced to be identically zero.
 *
 * Vanilla JS, self-contained, scoped to #poly-encoder. No globals leak except the
 * IIFE. Reads theme colors from CSS variables so it matches light/dark mode.
 */
(function () {
  "use strict";

  var root = document.getElementById("poly-encoder");
  if (!root) return;

  var MIN = -6, MAX = 6;                 // integer ticks on the number line
  var A = [];                            // chosen roots (sorted ints)
  var d = 3;                             // target degree

  // ---- build DOM -----------------------------------------------------------
  var line = root.querySelector(".pw-line");
  var dVal = root.querySelector(".pw-d");
  var dSlider = root.querySelector(".pw-slider");
  var latexEl = root.querySelector(".pw-latex");
  var warnEl = root.querySelector(".pw-warn");
  var canvas = root.querySelector(".pw-canvas");
  var ctx = canvas.getContext("2d");

  for (var v = MIN; v <= MAX; v++) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "pw-node";
    b.textContent = v;
    b.setAttribute("data-v", v);
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", onToggle);
    line.appendChild(b);
  }

  dSlider.addEventListener("input", function () {
    d = parseInt(dSlider.value, 10);
    dVal.textContent = d;
    render();
  });

  function onToggle(e) {
    var v = parseInt(e.currentTarget.getAttribute("data-v"), 10);
    var i = A.indexOf(v);
    if (i === -1) { A.push(v); A.sort(function (a, b) { return a - b; }); }
    else { A.splice(i, 1); }
    e.currentTarget.setAttribute("aria-pressed", i === -1 ? "true" : "false");
    e.currentTarget.classList.toggle("is-on", i === -1);
    render();
  }

  // ---- math ----------------------------------------------------------------
  function evalProduct(x) {                 // P_A(x) = prod (x - a_i)
    var y = 1;
    for (var i = 0; i < A.length; i++) y *= (x - A[i]);
    return y;
  }

  function expandedCoeffs() {                // ascending powers: c[0] + c[1] x + ...
    var c = [1];
    for (var i = 0; i < A.length; i++) {
      var r = A[i], next = new Array(c.length + 1).fill(0);
      for (var k = 0; k < c.length; k++) {
        next[k] += c[k] * (-r);             // (x - r): constant part
        next[k + 1] += c[k];                // x part
      }
      c = next;
    }
    return c;
  }

  function factorTerm(r) {
    if (r === 0) return "x";
    return r > 0 ? "(x - " + r + ")" : "(x + " + (-r) + ")";
  }

  function expandedLatex(c) {
    var parts = [];
    for (var k = c.length - 1; k >= 0; k--) {
      var coef = c[k];
      if (coef === 0) continue;
      var sign = coef < 0 ? "-" : "+";
      var mag = Math.abs(coef);
      var body;
      if (k === 0) body = mag;
      else {
        var xpart = k === 1 ? "x" : "x^{" + k + "}";
        body = (mag === 1 ? "" : mag) + xpart;
      }
      if (parts.length === 0) parts.push((coef < 0 ? "-" : "") + body);
      else parts.push(" " + sign + " " + body);
    }
    return parts.length ? parts.join("") : "0";
  }

  // ---- render --------------------------------------------------------------
  function render() {
    var forcedZero = A.length > d && A.length > 0;

    // LaTeX
    var tex;
    if (A.length === 0) {
      tex = "P_A(x) = 1 \\quad (\\text{empty product})";
    } else if (forcedZero) {
      tex = "P_A(x) = \\prod_{i=1}^{" + A.length + "}(x - a_i) \\equiv 0";
    } else {
      var factored = A.map(factorTerm).join("");
      tex = "P_A(x) = " + factored + " = " + expandedLatex(expandedCoeffs());
    }
    latexEl.innerHTML = "$$" + tex + "$$";
    if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([latexEl]);

    // warning
    if (forcedZero) {
      warnEl.textContent =
        "A degree-" + d + " polynomial can have at most " + d +
        " roots — but you gave it " + A.length +
        ". Vanishing at d+1 points forces it to be identically zero.";
      warnEl.hidden = false;
    } else {
      warnEl.hidden = true;
    }

    drawPlot(forcedZero);
  }

  function cssVar(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name);
    return (v && v.trim()) || fallback;
  }

  function drawPlot(forcedZero) {
    var dpr = window.devicePixelRatio || 1;
    var cssW = canvas.clientWidth || 640, cssH = 300;
    canvas.width = cssW * dpr; canvas.height = cssH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    var pad = 24;
    var xMin = MIN - 0.5, xMax = MAX + 0.5;
    var X = function (x) { return pad + (x - xMin) / (xMax - xMin) * (cssW - 2 * pad); };

    // sample
    var N = 700, xs = [], ys = [], absv = [];
    for (var i = 0; i <= N; i++) {
      var x = xMin + (xMax - xMin) * i / N;
      var y = forcedZero ? 0 : evalProduct(x);
      xs.push(x); ys.push(y); absv.push(Math.abs(y));
    }
    // robust y-scale: 88th percentile so a single spike doesn't flatten everything
    var sorted = absv.slice().sort(function (a, b) { return a - b; });
    var ref = sorted[Math.floor(0.88 * sorted.length)] || 1;
    var yMax = Math.max(ref, 1);
    var midY = cssH / 2;
    var Y = function (y) {
      var yy = midY - (y / yMax) * (cssH / 2 - pad);
      return Math.max(2, Math.min(cssH - 2, yy));
    };

    var textCol = cssVar("--text-secondary", "#74809a");
    var hair = cssVar("--hairline", "rgba(27,42,68,0.12)");
    var lineCol = cssVar("--links", "#3f68cc");

    // axes
    ctx.strokeStyle = hair; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad, midY); ctx.lineTo(cssW - pad, midY); ctx.stroke();
    // x ticks + labels
    ctx.fillStyle = textCol; ctx.font = "12px 'Roboto Mono', monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    for (var t = MIN; t <= MAX; t++) {
      var px = X(t);
      ctx.strokeStyle = hair; ctx.beginPath();
      ctx.moveTo(px, midY - 3); ctx.lineTo(px, midY + 3); ctx.stroke();
      ctx.fillText(t, px, midY + 6);
    }

    // curve
    ctx.strokeStyle = forcedZero ? cssVar("--text-secondary", "#888") : lineCol;
    ctx.lineWidth = forcedZero ? 3 : 2.5;
    ctx.beginPath();
    for (var j = 0; j < xs.length; j++) {
      var pxj = X(xs[j]), pyj = Y(ys[j]);
      if (j === 0) ctx.moveTo(pxj, pyj); else ctx.lineTo(pxj, pyj);
    }
    ctx.stroke();

    // root markers
    if (!forcedZero) {
      ctx.fillStyle = lineCol;
      for (var r = 0; r < A.length; r++) {
        ctx.beginPath();
        ctx.arc(X(A[r]), midY, 4.5, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }

  // redraw on theme toggle so canvas colors follow light/dark
  new MutationObserver(function () { render(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  window.addEventListener("resize", function () { render(); });

  dSlider.value = d; dVal.textContent = d;
  render();
})();
