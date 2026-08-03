(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  var reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  function syncReducedMotionClass() {
    document.documentElement.classList.toggle("reduced-motion", reduceMotionQuery.matches);
  }
  syncReducedMotionClass();
  if (reduceMotionQuery.addEventListener) {
    reduceMotionQuery.addEventListener("change", syncReducedMotionClass);
  }

  /* ---------------- Mobile navigation ---------------- */
  var navToggle = document.querySelector("[data-nav-toggle]");
  var nav = document.getElementById("primary-navigation");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------------- Scroll reveal ---------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------- Angebotsformular: Objektart-abhängige Felder ---------------- */
  var form = document.getElementById("angebot-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = document.getElementById("form-status");
      if (status) {
        status.textContent =
          "Diese Website ist eine Vorschau ohne angebundenen Versand. Bitte kontaktieren Sie AMMA bis zur technischen Anbindung direkt per Telefon oder E-Mail.";
        status.hidden = false;
        status.focus();
      }
    });
  }

  /* ---------------- Aktuelles Jahr im Footer ---------------- */
  var yearEl = document.getElementById("current-year");
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }
})();
