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

// Slideshow
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
let current = 0;
let timer;

function goTo(index) {
  slides[current].classList.remove("active");
  dots[current].classList.remove("active");
  current = (index + slides.length) % slides.length;
  slides[current].classList.add("active");
  dots[current].classList.add("active");
}

function next() {
  goTo(current + 1);
}
function prev() {
  goTo(current - 1);
}

function startTimer() {
  timer = setInterval(next, 4000);
}

function resetTimer() {
  clearInterval(timer);
  startTimer();
}

document.querySelector(".slide-btn.next").addEventListener("click", () => {
  next();
  resetTimer();
});
document.querySelector(".slide-btn.prev").addEventListener("click", () => {
  prev();
  resetTimer();
});
dots.forEach((dot, i) =>
  dot.addEventListener("click", () => {
    goTo(i);
    resetTimer();
  }),
);

startTimer();

const hamburger = document.getElementById("hamburger");
const navbar = document.getElementById("banner-navbar");

hamburger.addEventListener("click", (e) => {
  e.stopPropagation();
  hamburger.classList.toggle("open");
  navbar.classList.toggle("open");
});

// Cierra el menú al pinchar un enlace
navbar.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navbar.classList.remove("open");
  });
});

// Cierra el menú al pinchar fuera
document.addEventListener("click", () => {
  hamburger.classList.remove("open");
  navbar.classList.remove("open");
});
