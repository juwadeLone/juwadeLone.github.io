"use strict";
// Progressive enhancement: content remains visible without JS or motion support.
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let observer;
  const showAll = () => {
    document.documentElement.classList.remove("motion-ready");
    observer?.disconnect();
  };
  try {
    if (!reduced.matches && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, {threshold: 0.06});
      document.querySelectorAll(".section-heading,.service-card,.product-card,.scene-card,.algorithm-card,.case-card,.resource-card,.process-grid li,.platform-metrics>div,.platform-viewer,.platform-offer li").forEach((element, index) => {
        element.dataset.reveal = "";
        element.style.setProperty("--reveal-delay", `${(index % 3) * 55}ms`);
        observer.observe(element);
      });
      document.documentElement.classList.add("motion-ready");
      document.addEventListener("focusin", event => {
        event.target.closest("[data-reveal]")?.classList.add("is-visible");
      });
      reduced.addEventListener("change", showAll);
      const revealTarget = () => {
        const target = document.getElementById(location.hash.slice(1));
        target?.querySelectorAll("[data-reveal]").forEach(el => el.classList.add("is-visible"));
      };
      window.addEventListener("hashchange", revealTarget);
      revealTarget();
    }
  } catch {
    showAll();
  }
})();
