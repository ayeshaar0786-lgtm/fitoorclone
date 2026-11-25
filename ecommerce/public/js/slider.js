const slides = document.querySelectorAll(".slide");
const dotsWrap = document.querySelector(".dots");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const INTERVAL = 7000;

let current = 0;
let timer;

slides.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.className = "dot" + (i === 0 ? " active" : "");
  dot.setAttribute("aria-label", "Show slide " + (i + 1));
  dot.addEventListener("click", () => {
    show(i);
    restart();
  });
  dotsWrap.appendChild(dot);
});

const dots = dotsWrap.querySelectorAll(".dot");

function show(index) {
  slides.forEach((s) => s.classList.remove("active"));
  dots.forEach((d) => d.classList.remove("active"));
  current = (index + slides.length) % slides.length;
  slides[current].classList.add("active");
  dots[current].classList.add("active");
}

function restart() {
  clearInterval(timer);
  timer = setInterval(() => show(current + 1), INTERVAL);
}

prevBtn.addEventListener("click", () => {
  show(current - 1);
  restart();
});

nextBtn.addEventListener("click", () => {
  show(current + 1);
  restart();
});

restart();