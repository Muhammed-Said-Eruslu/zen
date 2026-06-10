/**
 * stone-texture.js
 * Koyu obsidyen/bazalt taş dokusu: bakır mineral damarları, tane yüzeyi,
 * vignette. Yalnızca body.home-page olan sayfalarda çalışır.
 */
(function () {
  "use strict";
  if (!document.body.classList.contains("home-page")) return;

  const canvas = document.createElement("canvas");
  canvas.id = "stone-canvas";
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext("2d");

  /* ── SEEDED RNG ─────────────────────────────────────────── */
  let seed = 137;
  function rng() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
  }
  function rr(a, b) { return a + rng() * (b - a); }

  /* ── ÇIZIM ──────────────────────────────────────────────── */
  function draw() {
    seed = 137;
    const W = canvas.width, H = canvas.height;

    /* 1 — Koyu obsidyen taban */
    ctx.fillStyle = "#080808";
    ctx.fillRect(0, 0, W, H);

    /* 2 — Hacimsel derinlik bulutları */
    for (let i = 0; i < 10; i++) {
      const x  = rr(W * 0.04, W * 0.96);
      const y  = rr(H * 0.04, H * 0.96);
      const rx = rr(W * 0.14, W * 0.42);
      const ry = rr(H * 0.11, H * 0.35);
      const a  = rr(0.03, 0.10);
      const ratio = ry / rx;
      const g = ctx.createRadialGradient(x, y, 0, x, y, rx);
      g.addColorStop(0,   `rgba(72,67,61,${a})`);
      g.addColorStop(0.5, `rgba(48,45,40,${a * 0.45})`);
      g.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(1, ratio);
      ctx.translate(-x, -y);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, rx, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    /* 3 — Orta ölçekli yüzey değişimi */
    for (let i = 0; i < 65; i++) {
      const x = rr(0, W), y = rr(0, H);
      const r = rr(W * 0.007, W * 0.048);
      const a = rr(0.010, 0.042);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(88,82,75,${a})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    /* 4 — Koyu çukurlar */
    for (let i = 0; i < 45; i++) {
      const x = rr(0, W), y = rr(0, H);
      const r = rr(W * 0.005, W * 0.030);
      const a = rr(0.035, 0.115);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(0,0,0,${a})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    /* 5 — Damarlar ─────────────────────────────────────────── */
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    /* Bakır mineral damarları */
    for (let i = 0; i < 9; i++) {
      let x = rr(0, W), y = rr(0, H);
      const segs = Math.floor(rr(5, 15));
      const a  = rr(0.055, 0.22);
      const lw = rr(0.35, 1.8);
      ctx.strokeStyle = `rgba(184,138,68,${a})`;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let s = 0; s < segs; s++) {
        x += rr(-W * 0.10, W * 0.10);
        y += rr(-H * 0.08, H * 0.08);
        ctx.quadraticCurveTo(
          x + rr(-W * 0.038, W * 0.038),
          y + rr(-H * 0.038, H * 0.038),
          x, y
        );
      }
      ctx.stroke();
    }

    /* Sıcak amber ikincil damarlar */
    for (let i = 0; i < 6; i++) {
      let x = rr(0, W), y = rr(0, H);
      const segs = Math.floor(rr(3, 9));
      const a = rr(0.04, 0.13);
      ctx.strokeStyle = `rgba(200,155,87,${a})`;
      ctx.lineWidth = rr(0.2, 0.8);
      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let s = 0; s < segs; s++) {
        x += rr(-W * 0.07, W * 0.07);
        y += rr(-H * 0.06, H * 0.06);
        ctx.quadraticCurveTo(
          x + rr(-W * 0.025, W * 0.025),
          y + rr(-H * 0.025, H * 0.025),
          x, y
        );
      }
      ctx.stroke();
    }

    /* Gri strüktürel çatlaklar */
    for (let i = 0; i < 16; i++) {
      let x = rr(0, W), y = rr(0, H);
      const segs = Math.floor(rr(4, 12));
      const a = rr(0.025, 0.095);
      ctx.strokeStyle = `rgba(115,110,103,${a})`;
      ctx.lineWidth = rr(0.25, 1.0);
      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let s = 0; s < segs; s++) {
        x += rr(-W * 0.09, W * 0.09);
        y += rr(-H * 0.07, H * 0.07);
        ctx.quadraticCurveTo(
          x + rr(-W * 0.03, W * 0.03),
          y + rr(-H * 0.03, H * 0.03),
          x, y
        );
      }
      ctx.stroke();
    }

    /* Mikro çatlaklar */
    for (let i = 0; i < 80; i++) {
      const x1 = rr(0, W), y1 = rr(0, H);
      ctx.strokeStyle = `rgba(100,96,90,${rr(0.012, 0.048)})`;
      ctx.lineWidth = rr(0.10, 0.40);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 + rr(-W * 0.04, W * 0.04), y1 + rr(-H * 0.04, H * 0.04));
      ctx.stroke();
    }

    /* 6 — Piksel tanesi (sıcak & koyu ağırlıklı) */
    const imgData = ctx.createImageData(W, H);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (rng() - 0.64) * 46;
      const v = Math.max(0, Math.min(255, n));
      d[i]     = Math.min(255, v + 2);
      d[i + 1] = v;
      d[i + 2] = Math.max(0, v - 4);
      d[i + 3] = Math.floor(rng() * 48 + 16);
    }
    ctx.putImageData(imgData, 0, 0);

    /* 7 — Bakır/amber bloom */
    const bloom = ctx.createRadialGradient(
      W * 0.40, H * 0.34, 0,
      W * 0.50, H * 0.50, Math.max(W, H) * 0.78
    );
    bloom.addColorStop(0,    "rgba(184,138,68,0.058)");
    bloom.addColorStop(0.32, "rgba(145,105,58,0.028)");
    bloom.addColorStop(1,    "rgba(0,0,0,0)");
    ctx.fillStyle = bloom;
    ctx.fillRect(0, 0, W, H);

    /* 8 — Vignette */
    const vig = ctx.createRadialGradient(
      W / 2, H / 2, Math.min(W, H) * 0.10,
      W / 2, H / 2, Math.max(W, H) * 0.80
    );
    vig.addColorStop(0,    "rgba(0,0,0,0)");
    vig.addColorStop(0.38, "rgba(0,0,0,0.10)");
    vig.addColorStop(0.70, "rgba(0,0,0,0.46)");
    vig.addColorStop(1,    "rgba(0,0,0,0.82)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);

    /* Köşe karartması */
    [[0, 0], [W, 0], [0, H], [W, H]].forEach(([cx, cy]) => {
      const r = Math.max(W, H) * 0.62;
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      cg.addColorStop(0,    "rgba(0,0,0,0.68)");
      cg.addColorStop(0.38, "rgba(0,0,0,0.22)");
      cg.addColorStop(1,    "rgba(0,0,0,0)");
      ctx.fillStyle = cg;
      ctx.fillRect(0, 0, W, H);
    });
  }

  /* ── RESIZE ─────────────────────────────────────────────── */
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
  }

  resize();

  let t;
  window.addEventListener("resize", () => {
    clearTimeout(t);
    t = setTimeout(resize, 150);
  });
})();
