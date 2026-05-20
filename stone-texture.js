/**
 * stone-texture.js
 * Referans görseldeki koyu antrasit / bazalt taş dokusunu Canvas API
 * ile üretir. Sadece <body class="home-page"> olan sayfada çalışır.
 *
 * Kullanım: </body> kapanışından hemen önce ekle:
 * <script src="stone-texture.js"></script>
 */

(function () {
  "use strict";

  if (!document.body.classList.contains("home-page")) return;

  /* ─── CANVAS KURULUMU ──────────────────────────────────── */
  const canvas = document.createElement("canvas");
  canvas.id = "stone-canvas";
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext("2d");

  /* ─── SEEDED PSEUDO-RANDOM ─────────────────────────────── */
  let seed = 137;
  function rng() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
  }
  function rr(min, max) { return min + rng() * (max - min); }

  /* ─── ANA FONKSİYON ────────────────────────────────────── */
  function draw() {
    seed = 137;
    const W = canvas.width;
    const H = canvas.height;

    /* == KATMAN 1: Çok koyu temel zemin == */
    ctx.fillStyle = "#0e0e0e";
    ctx.fillRect(0, 0, W, H);

    /* == KATMAN 2: Büyük hacimsel lekeler (taşın iç renk dalgalanması) == */
    /* Görselde görülen o soluk beyaz/gri bulut benzeri alanlar */
    for (let i = 0; i < 9; i++) {
      const x  = rr(W * 0.05, W * 0.95);
      const y  = rr(H * 0.05, H * 0.95);
      const rx = rr(W * 0.15, W * 0.40);
      const ry = rr(H * 0.12, H * 0.35);
      /* çok düşük opaklık — sadece hafif aydınlanma */
      const alpha = rr(0.04, 0.11);

      const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry));
      g.addColorStop(0,   `rgba(90, 88, 85, ${alpha})`);
      g.addColorStop(0.45, `rgba(60, 58, 56, ${alpha * 0.5})`);
      g.addColorStop(1,   "rgba(0,0,0,0)");

      ctx.save();
      ctx.translate(x, y);
      /* elips için scale */
      const ratio = ry / rx;
      ctx.scale(1, ratio);
      ctx.translate(-x, -y / ratio);

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y / ratio, rx, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    /* == KATMAN 3: Orta ölçek lekeleri — taşın pürüzlü yüzeyi == */
    for (let i = 0; i < 55; i++) {
      const x = rr(0, W);
      const y = rr(0, H);
      const r = rr(W * 0.01, W * 0.055);
      const alpha = rr(0.015, 0.055);

      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0,   `rgba(100, 97, 92, ${alpha})`);
      g.addColorStop(1,   "rgba(0,0,0,0)");

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    /* == KATMAN 4: Karanlık çukur lekeleri — taşın koyu derinlikleri == */
    for (let i = 0; i < 40; i++) {
      const x = rr(0, W);
      const y = rr(0, H);
      const r = rr(W * 0.008, W * 0.04);
      const alpha = rr(0.04, 0.14);

      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0,   `rgba(0, 0, 0, ${alpha})`);
      g.addColorStop(1,   "rgba(0,0,0,0)");

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    /* == KATMAN 5: Taş damarları / mikroçatlaklar == */
    ctx.lineCap  = "round";
    ctx.lineJoin = "round";

    /* Ana damarlar */
    for (let i = 0; i < 12; i++) {
      let x = rr(0, W);
      let y = rr(0, H);
      const segs  = Math.floor(rr(4, 12));
      const alpha = rr(0.04, 0.13);
      const lw    = rr(0.3, 1.2);

      ctx.strokeStyle = `rgba(130, 125, 118, ${alpha})`;
      ctx.lineWidth   = lw;
      ctx.beginPath();
      ctx.moveTo(x, y);

      for (let s = 0; s < segs; s++) {
        x += rr(-W * 0.1, W * 0.1);
        y += rr(-H * 0.08, H * 0.08);
        /* bezier kontrol noktası ile organik kıvrım */
        const cpx = x + rr(-W * 0.04, W * 0.04);
        const cpy = y + rr(-H * 0.04, H * 0.04);
        ctx.quadraticCurveTo(cpx, cpy, x, y);
      }
      ctx.stroke();
    }

    /* İnce ikincil çatlaklar */
    for (let i = 0; i < 60; i++) {
      const x1 = rr(0, W), y1 = rr(0, H);
      const x2 = x1 + rr(-W * 0.05, W * 0.05);
      const y2 = y1 + rr(-H * 0.05, H * 0.05);
      ctx.strokeStyle = `rgba(110, 106, 100, ${rr(0.02, 0.07)})`;
      ctx.lineWidth   = rr(0.15, 0.55);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    /* == KATMAN 6: Piksel gürültüsü — taşın granül dokusu == */
    /*
      ImageData ile her piksele rastgele ±brightness.
      Bu katman görseldeki "kum tane" hissini verir.
      Koyu ağırlıklı: negatif gürültü pozitiften fazla.
    */
    const imgData = ctx.createImageData(W, H);
    const data    = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      /* koyu tarafa çekimli gürültü */
      const n = (rng() - 0.62) * 52;
      const v = Math.max(0, Math.min(255, n));
      data[i]     = v;
      data[i + 1] = v;
      data[i + 2] = Math.max(0, Math.min(255, v - 2)); /* hafif soğuk */
      /* opaklık: çoğu piksel yarı saydam, bazıları daha opak */
      data[i + 3] = Math.floor(rng() * 55 + 20);
    }

    ctx.putImageData(imgData, 0, 0);

    /* == KATMAN 7: Hafif sıcak amber ton — görseldeki kahve ısısı == */
    const warmGrad = ctx.createRadialGradient(
      W * 0.40, H * 0.36, 0,
      W * 0.50, H * 0.50, Math.max(W, H) * 0.8
    );
    warmGrad.addColorStop(0,   "rgba(160, 115, 70, 0.06)");
    warmGrad.addColorStop(0.5, "rgba(120,  85, 50, 0.03)");
    warmGrad.addColorStop(1,   "rgba(0,0,0,0)");
    ctx.fillStyle = warmGrad;
    ctx.fillRect(0, 0, W, H);

    /* == KATMAN 8: Güçlü vignette — kenarlar ve köşeler siyah == */
    /*
      Görselde köşeler neredeyse tam siyah, orta alan çok az daha açık.
      İki aşamalı vignette: dairesel + köşe spotları.
    */

    /* Dairesel ana vignette */
    const vig1 = ctx.createRadialGradient(
      W / 2, H / 2, Math.min(W, H) * 0.15,
      W / 2, H / 2, Math.max(W, H) * 0.82
    );
    vig1.addColorStop(0,    "rgba(0,0,0,0)");
    vig1.addColorStop(0.45, "rgba(0,0,0,0.15)");
    vig1.addColorStop(0.75, "rgba(0,0,0,0.52)");
    vig1.addColorStop(1,    "rgba(0,0,0,0.84)");
    ctx.fillStyle = vig1;
    ctx.fillRect(0, 0, W, H);

    /* 4 köşe için ayrı koyu nokta */
    const corners = [[0, 0], [W, 0], [0, H], [W, H]];
    corners.forEach(([cx, cy]) => {
      const cr = Math.max(W, H) * 0.65;
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
      cg.addColorStop(0,    "rgba(0,0,0,0.72)");
      cg.addColorStop(0.4,  "rgba(0,0,0,0.30)");
      cg.addColorStop(1,    "rgba(0,0,0,0)");
      ctx.fillStyle = cg;
      ctx.fillRect(0, 0, W, H);
    });

    /* Üst ve alt kenar karartması */
    const topGrad = ctx.createLinearGradient(0, 0, 0, H * 0.28);
    topGrad.addColorStop(0,   "rgba(0,0,0,0.55)");
    topGrad.addColorStop(1,   "rgba(0,0,0,0)");
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, W, H * 0.28);

    const botGrad = ctx.createLinearGradient(0, H, 0, H * 0.72);
    botGrad.addColorStop(0,   "rgba(0,0,0,0.55)");
    botGrad.addColorStop(1,   "rgba(0,0,0,0)");
    ctx.fillStyle = botGrad;
    ctx.fillRect(0, H * 0.72, W, H * 0.28);

    /* Sol ve sağ kenar */
    const leftGrad = ctx.createLinearGradient(0, 0, W * 0.18, 0);
    leftGrad.addColorStop(0,  "rgba(0,0,0,0.45)");
    leftGrad.addColorStop(1,  "rgba(0,0,0,0)");
    ctx.fillStyle = leftGrad;
    ctx.fillRect(0, 0, W * 0.18, H);

    const rightGrad = ctx.createLinearGradient(W, 0, W * 0.82, 0);
    rightGrad.addColorStop(0,  "rgba(0,0,0,0.45)");
    rightGrad.addColorStop(1,  "rgba(0,0,0,0)");
    ctx.fillStyle = rightGrad;
    ctx.fillRect(W * 0.82, 0, W * 0.18, H);
  }

  /* ─── RESIZE ───────────────────────────────────────────── */
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