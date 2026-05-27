// Toggle "Ver más / Ver menos"
document.querySelectorAll(".toggle-btn").forEach((btn) => {
  const p = btn.previousElementSibling;
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const expanded = p.classList.toggle("expanded");
    btn.textContent = expanded ? "See less" : "See more";
  });
});

// Click en card → abre enlace de itch.io en pestaña nueva
// Solo navega si el click no viene del botón
document.querySelectorAll(".project-card[data-url]").forEach((card) => {
  card.addEventListener("click", (e) => {
    if (e.target.classList.contains("toggle-btn")) return;
    window.open(card.dataset.url, "_blank");
  });
});
