function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function setupAudioPreview() {
  const audio = document.getElementById("romanceAudio");
  if (!audio) return;

  const previewSeconds = Number(audio.dataset.previewSeconds || "40");
  if (!Number.isFinite(previewSeconds) || previewSeconds <= 0) return;

  let hasStarted = false;

  const stopAtPreview = () => {
    if (audio.currentTime >= previewSeconds) {
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener("timeupdate", stopAtPreview);
    }
  };

  const tryPlay = () => {
    if (hasStarted || prefersReducedMotion()) return;
    hasStarted = true;
    audio.addEventListener("timeupdate", stopAtPreview);

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Autoplay policies may still block; ignore quietly.
      });
    }
  };

  // Autoplay is usually blocked without a gesture. Start on the first gesture.
  document.addEventListener("pointerdown", tryPlay, { once: true });
  document.addEventListener("keydown", tryPlay, { once: true });
}

function isModifiedClick(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function createGlitterBurst({ x, y }) {
  const burst = document.createElement("div");
  burst.className = "glitter";
  burst.style.left = `${x}px`;
  burst.style.top = `${y}px`;

  const sparkleCount = 20;
  for (let index = 0; index < sparkleCount; index += 1) {
    const sparkle = document.createElement("i");
    sparkle.className = "glitter__spark";

    const angle = Math.random() * Math.PI * 2;
    const distance = 70 + Math.random() * 70;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    sparkle.style.setProperty("--dx", `${dx}px`);
    sparkle.style.setProperty("--dy", `${dy}px`);
    sparkle.style.setProperty("--rot", `${Math.floor(Math.random() * 260)}deg`);
    sparkle.style.setProperty("--delay", `${Math.random() * 110}ms`);
    sparkle.style.setProperty("--size", `${2 + Math.random() * 3}px`);
    sparkle.style.setProperty("--blur", `${Math.random() * 1.2}px`);
    sparkle.style.setProperty("--alpha", `${0.65 + Math.random() * 0.35}`);

    burst.appendChild(sparkle);
  }

  document.body.appendChild(burst);
  window.setTimeout(() => burst.remove(), 850);
}

function hookGlitterNavigation(link) {
  link.addEventListener("click", (event) => {
    if (prefersReducedMotion() || isModifiedClick(event)) return;
    if (!link.href) return;

    event.preventDefault();

    const rect = link.getBoundingClientRect();
    createGlitterBurst({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });

    window.setTimeout(() => {
      window.location.href = link.href;
    }, 420);
  });
}

// Landing page button (current)
const landingLink = document.querySelector(".card__button");
if (landingLink) hookGlitterNavigation(landingLink);

// Backward compatibility if an older button exists
const openGiftButton = document.getElementById("openGift");
if (openGiftButton && openGiftButton.tagName.toLowerCase() === "button") {
  openGiftButton.addEventListener("click", () => {
    if (prefersReducedMotion()) {
      window.location.href = "gift-card.html";
      return;
    }

    const rect = openGiftButton.getBoundingClientRect();
    createGlitterBurst({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    window.setTimeout(() => {
      window.location.href = "gift-card.html";
    }, 420);
  });
}

setupAudioPreview();
