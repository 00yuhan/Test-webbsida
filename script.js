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


let scrollInterval;

// Reusable function for all arrows
function scrollToNext(targetId) {
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    const startPosition = window.pageYOffset;
    const targetPosition = targetElement.offsetTop;
    const distance = targetPosition - startPosition;
    const duration = 1500;
    let start = null;

    const stopScroll = () => {
        cancelAnimationFrame(scrollInterval);
        window.removeEventListener('wheel', stopScroll);
        window.removeEventListener('touchmove', stopScroll);
    };

    window.addEventListener('wheel', stopScroll);
    window.addEventListener('touchmove', stopScroll);

    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percentage = Math.min(progress / duration, 1);
        const ease = 1 - Math.pow(1 - percentage, 3); // EaseOutCubic

        window.scrollTo({
            top: startPosition + distance * ease,
            behavior: 'instant' // Overrides CSS to let JS control the speed
        });

        if (progress < duration) {
            scrollInterval = requestAnimationFrame(step);
        } else {
            stopScroll();
        }
    }
    requestAnimationFrame(step);
}

// Smooth Back to Top for the Name Link
document.querySelector('.logo-link').addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Simple browser smooth scroll
    });
});


/*
    // This variable lives outside the function so we can stop it from anywhere
    let scrollInterval;

    function scrollToContent(targetId) {
    const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      const startPosition = window.pageYOffset;
      const targetPosition = targetElement.offsetTop; 
      const distance = targetPosition - startPosition;

      const duration = 1500; 
      let start = null;

*/
/*

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

    window.scrollTo({
    top: startPosition + distance * easeOutCubic(percentage),
    behavior: 'instant' // This tells the browser: "Don't try to be smooth, I've got this!"
    });

    /*window.scrollTo(0, startPosition + distance * easeOutCubic(percentage));

    if (progress < duration) {
      scrollInterval = window.requestAnimationFrame(step);
    } else {
      // Animation finished naturally, clean up the listeners
      stopScroll();
    }
  }

  scrollInterval = window.requestAnimationFrame(step);
}
*/
/*
// Target your name link (the logo)
// Make sure your HTML looks like: <a href="#" class="logo-link">YU-HAN HUA</a>
document.querySelector('nav li:first-child a').addEventListener('click', function(e) {
    e.preventDefault(); // Stop the instant "jump"
    
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // This is the browser's built-in smooth scroll
    });
});
 */