// javascript.js — smooth scroll, reveal sections, y navegación activa
document.addEventListener("DOMContentLoaded", () => {
  // Selectores
  const header = document.querySelector(".site-header");
  const navLinks = Array.from(document.querySelectorAll(".main-nav .nav-link"));
  const panels = Array.from(document.querySelectorAll(".panel"));

  // --- Smooth scroll para enlaces internos ---
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();

      // Calcular posición teniendo en cuenta la altura del header
      const yOffset = header ? header.offsetHeight + 8 : 8;
      const targetY =
        target.getBoundingClientRect().top + window.scrollY - yOffset;

      window.scrollTo({ top: targetY, behavior: "smooth" });

      // Actualizamos la URL sin provocar salto
      history.replaceState(null, "", `#${id}`);
    });
  });

  // --- IntersectionObserver: revelar secciones (añade clase 'visible') ---
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.18 }
  );

  panels.forEach((p) => revealObserver.observe(p));

  // --- IntersectionObserver: actualizar enlace activo del nav ---
  // Usamos un umbral mayor para detectar la sección principal en pantalla
  const activeObserver = new IntersectionObserver(
    (entries) => {
      // Encontrar la entrada con mayor intersección
      const visibleEntries = entries.filter((e) => e.isIntersecting);
      if (visibleEntries.length === 0) return;

      // Ordenar por intersectionRatio para elegir la más visible
      visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      const topEntry = visibleEntries[0];
      const id = topEntry.target.id;

      // Actualiza clases/atributos en los enlaces
      navLinks.forEach((link) => {
        const href = link.getAttribute("href") || "";
        const linkId = href.startsWith("#") ? href.slice(1) : null;
        if (linkId === id) {
          link.classList.add("active");
          link.setAttribute("aria-current", "true");
        } else {
          link.classList.remove("active");
          link.removeAttribute("aria-current");
        }
      });
    },
    {
      threshold: buildThresholdList(), // lista de umbrales para mejor precisión
      rootMargin: `-20% 0px -20% 0px`,
    }
  );

  panels.forEach((p) => activeObserver.observe(p));

  // Construye una lista de thresholds (0..1) para un observer más fino
  function buildThresholdList() {
    const thresholds = [];
    const numSteps = 20;
    for (let i = 0; i <= numSteps; i++) thresholds.push(i / numSteps);
    return thresholds;
  }

  // --- Inicializar estado en carga (si hay hash en la URL) ---
  if (location.hash) {
    const id = location.hash.slice(1);
    const target = document.getElementById(id);
    if (target) {
      // Esperar un tick para que el layout esté listo
      setTimeout(() => {
        const yOffset = header ? header.offsetHeight + 8 : 8;
        const pos =
          target.getBoundingClientRect().top + window.scrollY - yOffset;
        window.scrollTo({ top: pos, behavior: "smooth" });
      }, 80);
    }
  }

  // --- Mejora: actualizar active también al hacer scroll manual (fallback) ---
  // Por si el observer no detecta cambios finos en ciertos navegadores:
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        // Forzamos comprobación: el observer hará el resto, aquí actuamos como fallback
        ticking = false;
      });
      ticking = true;
    }
  });

  // --- (Opcional) soporte para teclado: navegar con flechas (mejora UX) ---
  document.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    // Encontrar la sección actualmente activa
    const currentIndex = panels.findIndex(
      (p) =>
        p.classList.contains("visible") &&
        p.getBoundingClientRect().top >= -header.offsetHeight
    );
    let nextIndex = currentIndex;
    if (e.key === "ArrowDown")
      nextIndex = Math.min(panels.length - 1, currentIndex + 1);
    if (e.key === "ArrowUp") nextIndex = Math.max(0, currentIndex - 1);
    if (nextIndex !== currentIndex && panels[nextIndex]) {
      const yOffset = header ? header.offsetHeight + 8 : 8;
      const pos =
        panels[nextIndex].getBoundingClientRect().top +
        window.scrollY -
        yOffset;
      window.scrollTo({ top: pos, behavior: "smooth" });
      e.preventDefault();
    }
  });
});
