"use strict";
(() => {
  const viewer = document.querySelector("[data-radiation-viewer]");
  if (!viewer) return;
  const tabs = [...viewer.querySelectorAll("[data-view-tab]")];
  const scene = viewer.querySelector("[data-strike-scene]");
  const cells = [...scene.querySelectorAll("[data-cell]")];
  const initialBits = cells.map(cell => cell.querySelector("text").textContent);
  const play = viewer.querySelector("[data-strike-play]");
  const reset = viewer.querySelector("[data-strike-reset]");
  const status = viewer.querySelector("[data-strike-status]");
  const modes = [...viewer.querySelectorAll("[data-strike-mode]")];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let mode = "single";
  let running = false;
  let timer;

  // Keep dynamic text in the existing translation pass, including mid-demo switches.
  const write = (element, key) => {
    element.dataset.i18n = key;
    element.textContent = t(key);
  };
  const restore = () => {
    clearTimeout(timer);
    running = false;
    scene.classList.remove("is-running");
    cells.forEach((cell, index) => {
      cell.classList.remove("is-upset");
      cell.querySelector("text").textContent = initialBits[index];
    });
    play.disabled = false;
    reset.disabled = true;
    write(status, "strikeReady");
  };
  const finish = () => {
    clearTimeout(timer);
    running = false;
    scene.classList.remove("is-running");
    // Fixed teaching examples, not a device layout, sampled event or rate model.
    const impacted = mode === "single" ? [5] : [5, 6, 9];
    impacted.forEach(index => {
      cells[index].classList.add("is-upset");
      cells[index].querySelector("text").textContent = initialBits[index] === "0" ? "1" : "0";
    });
    play.disabled = false;
    reset.disabled = false;
    write(status, mode === "single" ? "strikeSingleResult" : "strikeMultipleResult");
  };
  play.addEventListener("click", () => {
    restore();
    reset.disabled = false;
    if (reducedMotion.matches) return finish();
    running = true;
    play.disabled = true;
    write(status, "strikeRunning");
    scene.classList.add("is-running");
    timer = setTimeout(finish, 1000);
  });
  reset.addEventListener("click", restore);
  modes.forEach(button => button.addEventListener("click", () => {
    restore();
    mode = button.dataset.strikeMode;
    modes.forEach(item => item.setAttribute("aria-pressed", String(item === button)));
  }));
  const handleMotionChange = event => {
    if (event.matches && running) finish();
  };
  // Older Safari exposes MediaQueryList.addListener rather than addEventListener.
  if (reducedMotion.addEventListener) reducedMotion.addEventListener("change", handleMotionChange);
  else reducedMotion.addListener(handleMotionChange);

  const orbits = {
    leo: {name: "orbitLeoName", copy: "orbitLeoBody", position: "translate(361 121)"},
    meo: {name: "orbitMeoName", copy: "orbitMeoBody", position: "translate(423 99)"},
    geo: {name: "orbitGeoName", copy: "orbitGeoBody", position: "translate(478 79)"}
  };
  const orbitScene = viewer.querySelector("[data-orbit-scene]");
  const orbitButtons = [...viewer.querySelectorAll("[data-orbit-choice]")];
  orbitButtons.forEach(button => button.addEventListener("click", () => {
    const orbit = orbits[button.dataset.orbitChoice];
    orbitScene.dataset.orbitScene = button.dataset.orbitChoice;
    orbitButtons.forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    orbitScene.querySelector("[data-orbit-satellite]").setAttribute("transform", orbit.position);
    write(viewer.querySelector("[data-orbit-name]"), orbit.name);
    write(viewer.querySelector("[data-orbit-copy]"), orbit.copy);
  }));

  const select = (tab, focus) => {
    if (running && tab.id !== "view-tab-strike") restore();
    tabs.forEach(item => {
      const active = item === tab;
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
      document.getElementById(item.getAttribute("aria-controls")).hidden = !active;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", event => {
      const next = {ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1}[event.key];
      if (next === undefined) return;
      event.preventDefault();
      select(tabs[(next + tabs.length) % tabs.length], true);
    });
  });
  // With no JS, all native views stay readable and inert controls stay hidden.
  select(tabs[0]);
  viewer.querySelector(".platform-tabs").hidden = false;
  viewer.querySelector("[data-strike-controls]").hidden = false;
  viewer.querySelector("[data-orbit-controls]").hidden = false;
})();
