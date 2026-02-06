window.addEventListener("scroll", () => {
  const header = document.getElementById("site-header");
  const hero = document.getElementById("hero");
  const fadeWrapper = document.getElementById("hero-fade-wrapper");
  const root = document.documentElement;

  if (!hero) return;

  const heroRect = hero.getBoundingClientRect();
  const heroHeight = heroRect.height;
  
  // Normal 0 to 1 scroll ratio
  const rawRatio = Math.min(
    Math.max((heroHeight - heroRect.bottom) / heroHeight, 0),
    1
  );

  // --- NEW FADE LOGIC ---
  const fadePoint = 0.6; // Change this to 0.5 for 50%, 0.8 for 80%, etc.
  const textFadeRatio = Math.min(rawRatio / fadePoint, 1);
  
  if (fadeWrapper) {
    fadeWrapper.style.opacity = 1 - textFadeRatio;
  }
  // ----------------------

  // Keep the navbar using the rawRatio so it stays solid until the very end
  const rgb = getComputedStyle(root).getPropertyValue("--header-bg-color").trim();
  const alphaStart = parseFloat(getComputedStyle(root).getPropertyValue("--header-bg-alpha-start")) || 0;
  const alphaEnd = parseFloat(getComputedStyle(root).getPropertyValue("--header-bg-alpha-end")) || 1;
  const blurMax = parseFloat(getComputedStyle(root).getPropertyValue("--header-blur-max")) || 10;

  const alpha = alphaStart + (alphaEnd - alphaStart) * rawRatio;
  const blur = blurMax * rawRatio;

  if (header) {
    header.style.backgroundColor = `rgba(${rgb}, ${alpha})`;
    header.style.backdropFilter = `blur(${blur}px)`;
    header.style.webkitBackdropFilter = `blur(${blur}px)`;
  }
});


// This variable lives outside the function so we can stop it from anywhere
let scrollInterval;

function scrollToContent() {
  const hero = document.getElementById("hero");
  if (!hero) return;

  const startPosition = window.pageYOffset;
  const targetPosition = hero.offsetHeight;
  const distance = targetPosition - startPosition;
  const duration = 1500; 
  let start = null;

  // 1. Function to stop the animation
  const stopScroll = () => {
    cancelAnimationFrame(scrollInterval);
    // Remove the listeners once stopped so we don't waste memory
    window.removeEventListener('wheel', stopScroll);
    window.removeEventListener('touchmove', stopScroll);
    window.removeEventListener('keydown', stopScroll);
  };

  // 2. Add listeners to detect if the user tries to manual scroll
  window.addEventListener('wheel', stopScroll);
  window.addEventListener('touchmove', stopScroll); // For phones
  window.addEventListener('keydown', (e) => {
    if (e.key === "ArrowUp" || e.key === "PageUp") stopScroll();
  });

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const percentage = Math.min(progress / duration, 1);

    window.scrollTo(0, startPosition + distance * easeOutCubic(percentage));

    if (progress < duration) {
      scrollInterval = window.requestAnimationFrame(step);
    } else {
      // Animation finished naturally, clean up the listeners
      stopScroll();
    }
  }

  scrollInterval = window.requestAnimationFrame(step);
}

/*
function scrollToContent() {
  const hero = document.getElementById("hero");
  if (!hero) return;

  const startPosition = window.pageYOffset;
  const targetPosition = hero.offsetHeight;
  const distance = targetPosition - startPosition;
  const duration = 1500; // Time in milliseconds (1.5 seconds)
  let start = null;

  // This is the "easing" function - it makes the scroll start fast and slow down at the end
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const percentage = Math.min(progress / duration, 1);

    // Calculate how far we should be at this exact moment
    window.scrollTo(0, startPosition + distance * easeOutCubic(percentage));

    if (progress < duration) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}
*/