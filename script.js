function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const AUDIO_NAV_FLAG_KEY = "chrstGift:playAudio";

function setupAudioAutoplayLoop() {
  const audio = document.getElementById("romanceAudio");
  if (!audio) return;

  audio.loop = true;

  const audioSrc = audio.getAttribute("src") || "";
  if (!audioSrc) {
    console.warn("[romance-audio] No src set on #romanceAudio");
    return;
  }

  const shouldAutoplay = window.sessionStorage.getItem(AUDIO_NAV_FLAG_KEY) === "1";
  if (!shouldAutoplay) return;
  window.sessionStorage.removeItem(AUDIO_NAV_FLAG_KEY);

  const tryPlayNow = () => {
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        console.warn(
          "[romance-audio] Playback blocked. Tap/click once to start. If it still fails, confirm the MP3 loads:",
          audioSrc,
        );
        document.addEventListener("pointerdown", () => audio.play().catch(() => {}), { once: true });
      });
    }
  };

  // Best-effort immediate start after the user pressed the button.
  tryPlayNow();
}

function isModifiedClick(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function setupDovesFeathersOverlay() {
  if (prefersReducedMotion()) return;

  const doveLeft = document.getElementById("doveLeft");
  const doveRight = document.getElementById("doveRight");
  if (!doveLeft || !doveRight) return;

  // Ensure a single overlay container
  let overlay = document.querySelector(".featherOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "featherOverlay";
    overlay.setAttribute("aria-hidden", "true");
    document.body.appendChild(overlay);
  }

  const maxFeathers = 420;

  const getCenterPoint = (element) => {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height * 0.65,
    };
  };

  const spawnFeather = (origin) => {
    if (!document.body.contains(overlay)) return;

    // Prevent infinite DOM growth
    if (overlay.childNodes.length >= maxFeathers) {
      // Remove a small chunk from the front
      for (let i = 0; i < 24; i += 1) {
        const node = overlay.firstChild;
        if (!node) break;
        node.remove();
      }
    }

    const feather = document.createElement("span");
    feather.className = "feather";

    const startX = origin.x + (-10 + Math.random() * 20);
    const startY = origin.y + (-8 + Math.random() * 16);

    const dx = -220 + Math.random() * 440;
    const dy = 620 + Math.random() * 520;
    const rot = (-60 + Math.random() * 120).toFixed(1);
    const spin = (60 + Math.random() * 140).toFixed(1);
    const dur = (4.8 + Math.random() * 3.2).toFixed(2);
    const alpha = (0.55 + Math.random() * 0.35).toFixed(2);
    const w = (12 + Math.random() * 20).toFixed(1);
    const h = (4 + Math.random() * 7).toFixed(1);

    feather.style.setProperty("--x", `${startX}px`);
    feather.style.setProperty("--y", `${startY}px`);
    feather.style.setProperty("--dx", `${dx}px`);
    feather.style.setProperty("--dy", `${dy}px`);
    feather.style.setProperty("--rot", `${rot}deg`);
    feather.style.setProperty("--spin", `${spin}deg`);
    feather.style.setProperty("--dur", `${dur}s`);
    feather.style.setProperty("--alpha", alpha);
    feather.style.setProperty("--w", `${w}px`);
    feather.style.setProperty("--h", `${h}px`);

    overlay.appendChild(feather);
    window.setTimeout(() => feather.remove(), Math.ceil(Number(dur) * 1000) + 250);
  };

  const spawnFromBoth = () => {
    // Keep them “in mid air”: doves stay fixed; only feathers move.
    const leftOrigin = getCenterPoint(doveLeft);
    const rightOrigin = getCenterPoint(doveRight);

    const leftCount = 2 + Math.floor(Math.random() * 3);
    const rightCount = 2 + Math.floor(Math.random() * 3);

    for (let i = 0; i < leftCount; i += 1) spawnFeather(leftOrigin);
    for (let i = 0; i < rightCount; i += 1) spawnFeather(rightOrigin);
  };

  // Match the wing flap cadence from CSS (~860ms)
  const intervalId = window.setInterval(spawnFromBoth, 860);

  // Clean up if user navigates away
  window.addEventListener(
    "pagehide",
    () => {
      window.clearInterval(intervalId);
      overlay?.remove();
    },
    { once: true },
  );
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
    // Request audio autoplay on the gift page (best-effort, depends on browser policies)
    try {
      window.sessionStorage.setItem(AUDIO_NAV_FLAG_KEY, "1");
    } catch {
      // ignore
    }

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

setupAudioAutoplayLoop();
setupDovesFeathersOverlay();
