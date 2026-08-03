/**
 * AMMA Hero – leichte 2.5D-Inszenierung (Variante C, vanilla JS, ohne Abhängigkeiten).
 * Ebenen: Foto (stärkster Parallax), Licht-Layer, Farb-/Grain-Layer (jeweils synthetische
 * CSS-Layer, siehe /docs/hero-implementation.md für die Begründung dieser Umsetzung).
 * Bewegung ausschließlich über transform/opacity, rAF-gedrosselt, deaktiviert bei
 * prefers-reduced-motion und auf Touch-Geräten (Mausreaktion).
 */
(function () {
  "use strict";

  var hero = document.querySelector("[data-hero]");
  if (!hero) { return; }

  var visual = hero.querySelector("[data-hero-visual]");
  var photoLayer = hero.querySelector("[data-hero-photo]");
  var lightLayer = hero.querySelector("[data-hero-light]");
  var grainLayer = hero.querySelector("[data-hero-grain]");
  var chips = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-chip]"));
  var isTouch = matchMedia("(hover: none), (pointer: coarse)").matches;
  var prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- 1. Ruhiger Einstieg ---- */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      if (visual) { visual.classList.add("is-ready"); }
    });
  });

  if (prefersReduced) {
    chips.forEach(function (chip) { chip.classList.add("is-visible"); });
    return; // keine Scroll-/Mausanimationen bei reduzierter Bewegung
  }

  /* ---- 2. Scroll-Parallax + Leistungsimpulse ---- */
  var ticking = false;
  var mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;

  function heroProgress() {
    var heroTopOffset = hero.offsetTop;
    var scrollStretch = window.innerHeight * 1.3; // ~130vh Hero-Scrollstrecke
    var progress = (window.scrollY - heroTopOffset) / scrollStretch;
    return Math.min(Math.max(progress, 0), 1);
  }

  function applyScroll() {
    var progress = heroProgress();

    if (photoLayer) {
      var photoShift = progress * 26; // Vordergrundwirkung des Fotos
      photoLayer.style.transform = "translate3d(0, " + photoShift.toFixed(2) + "px, 0) scale(1.02)";
    }
    if (lightLayer) {
      lightLayer.style.transform = "translate3d(0, " + (progress * 10).toFixed(2) + "px, 0)";
    }
    if (grainLayer) {
      grainLayer.style.transform = "translate3d(0, " + (progress * 4).toFixed(2) + "px, 0)";
    }

    var thresholds = [0.2, 0.45, 0.7];
    chips.forEach(function (chip, i) {
      if (progress >= thresholds[i]) { chip.classList.add("is-visible"); }
    });

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(applyScroll);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  applyScroll();

  /* ---- 3. Mausreaktion (nur Desktop, kein Touch) ---- */
  if (!isTouch && photoLayer) {
    var mouseTicking = false;

    function applyMouse() {
      targetX += (mouseX - targetX) * 0.12;
      targetY += (mouseY - targetY) * 0.12;
      var scrollShift = heroProgress() * 26;
      photoLayer.style.transform =
        "translate3d(" + targetX.toFixed(2) + "px, " + (scrollShift + targetY).toFixed(2) + "px, 0) scale(1.02)";
      if (Math.abs(targetX - mouseX) > 0.05 || Math.abs(targetY - mouseY) > 0.05) {
        requestAnimationFrame(applyMouse);
      } else {
        mouseTicking = false;
      }
    }

    visual.addEventListener("mousemove", function (e) {
      var rect = visual.getBoundingClientRect();
      var relX = (e.clientX - rect.left) / rect.width - 0.5;
      var relY = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = relX * -7;
      mouseY = relY * -7;
      if (!mouseTicking) {
        mouseTicking = true;
        requestAnimationFrame(applyMouse);
      }
    });

    visual.addEventListener("mouseleave", function () {
      mouseX = 0;
      mouseY = 0;
      if (!mouseTicking) {
        mouseTicking = true;
        requestAnimationFrame(applyMouse);
      }
    });
  }
})();
