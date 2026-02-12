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


/* ARROW FADE LOGIC*/

const observerOptions = {
    threshold: 0.4 // Shows arrows when 20% of the section is visible
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // This looks for the "sticky-wrapper" inside the section we are currently viewing
        const wrapper = entry.target.querySelector('.sticky-wrapper');
        
        if (entry.isIntersecting) {
            wrapper?.classList.add('is-active');
        } else {
            wrapper?.classList.remove('is-active');
        }
    });
}, observerOptions);

