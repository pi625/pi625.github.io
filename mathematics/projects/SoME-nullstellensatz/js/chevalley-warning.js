/* Widget · The Chevalley-Warning Scale
 * A balance scale comparing sum(deg f_i) against n. When sum < n the theorem
 * fires: #common zeros is divisible by p, so one solution forces at least p.
 * Scoped to #chevalley-scale.
 */
(function () {
  "use strict";
  var root = document.getElementById("chevalley-scale");
  if (!root) return;

  var PRIMES = [2, 3, 5, 7, 11], p = 5, n = 5, degs = [1, 1];
  var nEl = root.querySelector(".cw-n"), pEl = root.querySelector(".cw-p");
  PRIMES.forEach(function (q) { var o = document.createElement("option"); o.value = q; o.textContent = q; if (q === p) o.selected = true; pEl.appendChild(o); });
  var polys = root.querySelector(".cw-polys"), verdict = root.querySelector(".cw-verdict");
  var canvas = root.querySelector(".cw-canvas"), ctx = canvas.getContext("2d");
  var angle = 0, targetAngle = 0;

  nEl.addEventListener("input", function () { n = +nEl.value; sync(); });
  pEl.addEventListener("change", function () { p = +pEl.value; update(); });
  root.querySelector(".cw-add").addEventListener("click", function () { degs.push(1); sync(); });

  function sync() {
    polys.innerHTML = "";
    degs.forEach(function (d, i) {
      var wrap = document.createElement("span"); wrap.className = "cw-deg";
      wrap.innerHTML = "deg f<sub>" + (i + 1) + "</sub> ";
      var inp = document.createElement("input"); inp.type = "number"; inp.min = "0"; inp.max = "20"; inp.value = d;
      inp.addEventListener("input", function () { degs[i] = Math.max(0, +inp.value || 0); update(); });
      wrap.appendChild(inp);
      if (degs.length > 1) {
        var rm = document.createElement("button"); rm.textContent = "×"; rm.style.padding = ".05rem .4rem";
        rm.addEventListener("click", function () { degs.splice(i, 1); sync(); });
        wrap.appendChild(rm);
      }
      polys.appendChild(wrap);
    });
    update();
  }

  function update() {
    var sum = degs.reduce(function (a, b) { return a + b; }, 0);
    var fires = sum < n;
    targetAngle = fires ? -0.28 : (sum === n ? 0 : 0.28);
    verdict.className = "cw-verdict " + (fires ? "ok" : "no");
    verdict.innerHTML = fires
      ? "∑deg = " + sum + " < " + n + " = n ✓ — #zeros ≡ 0 (mod " + p + "); one solution ⇒ at least " + p + " solutions."
      : "∑deg = " + sum + " ≥ " + n + " = n — theorem does not apply.";
    draw(sum);
  }

  function cssVar(k, f) { var v = getComputedStyle(document.documentElement).getPropertyValue(k); return (v && v.trim()) || f; }

  function draw(sum) {
    var dpr = window.devicePixelRatio || 1, W = canvas.clientWidth || 600, H = 320;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    angle += (targetAngle - angle) * 0.2;
    var cx = W / 2, cy = 90, beam = Math.min(W, 480) / 2 - 20;
    var text = cssVar("--text", "#3b475f"), hair = cssVar("--hairline", "rgba(27,42,68,.2)"), links = cssVar("--links", "#3f68cc");
    // stand
    ctx.strokeStyle = hair; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, H - 30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - 60, H - 30); ctx.lineTo(cx + 60, H - 30); ctx.stroke();
    // beam
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(angle);
    ctx.strokeStyle = links; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-beam, 0); ctx.lineTo(beam, 0); ctx.stroke();
    ctx.restore();
    var lx = cx - beam * Math.cos(angle), ly = cy - beam * Math.sin(angle);
    var rx = cx + beam * Math.cos(angle), ry = cy + beam * Math.sin(angle);
    pan(lx, ly, "∑deg = " + sum, links, text);
    pan(rx, ry, "n = " + n, "#2e9e5b", text);
  }
  function pan(x, y, label, col, text) {
    ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 40); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y + 60, 26, Math.PI, 2 * Math.PI, true); ctx.stroke();
    ctx.fillStyle = text; ctx.font = "600 14px 'Source Sans 3', sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(label, x, y + 58);
  }

  (function loop() { draw(degs.reduce(function (a, b) { return a + b; }, 0)); if (Math.abs(targetAngle - angle) > 0.001) requestAnimationFrame(loop); })();
  new MutationObserver(function () { update(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  window.addEventListener("resize", update);
  nEl.value = n; sync();
})();
