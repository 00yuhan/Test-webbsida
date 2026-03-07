/**
 * 1. HEADER & HERO ANIMATION
 */
window.addEventListener("scroll", () => {
    const header = document.getElementById("site-header");
    const hero = document.getElementById("hero");
    const fadeWrapper = document.getElementById("hero-fade-wrapper");
    const root = document.documentElement;

    if (!hero) return;

    const heroRect = hero.getBoundingClientRect();
    const heroHeight = heroRect.height;
    const rawRatio = Math.min(Math.max((heroHeight - heroRect.bottom) / heroHeight, 0), 1);

    const fadePoint = 0.6; 
    const textFadeRatio = Math.min(rawRatio / fadePoint, 1);
    if (fadeWrapper) fadeWrapper.style.opacity = 1 - textFadeRatio;

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

/**
 * 2. REUSABLE SMOOTH SCROLL LOGIC
 */
let scrollInterval;
let isMoving = false; 

function scrollToNext(targetId, shouldCenter = false) {
    if (scrollInterval) cancelAnimationFrame(scrollInterval);
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    const startPosition = window.pageYOffset;
    const elementRect = targetElement.getBoundingClientRect();
    const absoluteElementTop = elementRect.top + window.pageYOffset;
    
    let targetPosition;
    if (shouldCenter) {
        targetPosition = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);
    } else {
        targetPosition = absoluteElementTop;
    }
    
    targetPosition = Math.max(targetPosition, 0);
    const distance = targetPosition - startPosition;
    const duration = 1200;
    let start = null;

    const handleUserInterrupt = () => {
        cancelAnimationFrame(scrollInterval);
        isMoving = false;
        isManualScrolling = false;
        window.removeEventListener('wheel', handleUserInterrupt);
        window.removeEventListener('touchmove', handleUserInterrupt);
    };

    window.addEventListener('wheel', handleUserInterrupt);
    window.addEventListener('touchmove', handleUserInterrupt);

    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percentage = Math.min(progress / duration, 1);
        const ease = 1 - Math.pow(1 - percentage, 3); 

        window.scrollTo({ top: startPosition + distance * ease, behavior: 'instant' });

        if (progress < duration) {
            scrollInterval = requestAnimationFrame(step);
        } else {
            isMoving = false;
            isManualScrolling = false;
            window.removeEventListener('wheel', handleUserInterrupt);
            window.removeEventListener('touchmove', handleUserInterrupt);
        }
    }
    scrollInterval = requestAnimationFrame(step);
}

document.querySelector('.logo-link').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/**
 * 3. INTERSECTION OBSERVERS (The "Reveal" Logic)
 */
document.addEventListener('DOMContentLoaded', () => {
    // Reveal Project Cards on Scroll
    const projectRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                projectRevealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3, rootMargin: "0px 0px -100px 0px"});

    document.querySelectorAll('.project-card').forEach(card => {
        projectRevealObserver.observe(card);
    });

        // ADD THIS PART:
    document.querySelectorAll('.sideProjectGrid img').forEach(img => {
        projectRevealObserver.observe(img);
    });

    // Handle Sticky Arrow Visibility
    const arrowObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const wrapper = entry.target.querySelector('.sticky-wrapper');
            if (wrapper) {
                entry.isIntersecting ? wrapper.classList.add('is-active') : wrapper.classList.remove('is-active');
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('section').forEach(section => arrowObserver.observe(section));
});

/**
 * 4. PROJECT WHEEL SYNC & FADE
 */
window.addEventListener("scroll", () => {
    const wheel = document.getElementById('project-wheel');
    const projectCards = document.querySelectorAll('.project-card');
    if (!wheel || projectCards.length === 0) return;

    const windowCenter = window.innerHeight / 2;
    const fadeRange = 600; 
    let maxOpacity = 0;

    projectCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distanceFromCenter = Math.abs(windowCenter - cardCenter);
        if (distanceFromCenter < fadeRange) {
            const currentOpacity = 1 - (distanceFromCenter / fadeRange);
            if (currentOpacity > maxOpacity) maxOpacity = currentOpacity;
        }
    });

    const finalOpacity = Math.max(0, Math.min(1, maxOpacity));
    wheel.style.opacity = finalOpacity;
    wheel.style.visibility = finalOpacity <= 0 ? "hidden" : "visible";
    wheel.style.pointerEvents = finalOpacity < 0.1 ? "none" : "auto";
});

const wheelTrack = document.querySelector('.wheel-track');
const wheelItems = document.querySelectorAll('.wheel-item');
const projectCards = document.querySelectorAll('.project-card');
let isManualScrolling = false;

function syncWheel() {
    if (isManualScrolling) return;
    const viewportCenter = window.innerHeight / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    projectCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenter - cardCenter);
        if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
        }
    });

    wheelItems.forEach((item, index) => {
        if (index === closestIndex) {
            item.classList.add('active');
            if(wheelTrack) wheelTrack.style.transform = `translateY(-${index * 70}px)`;
        } else {
            item.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', syncWheel);

wheelItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        isManualScrolling = true;
        wheelItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        if(wheelTrack) wheelTrack.style.transform = `translateY(-${index * 70}px)`;
        scrollToNext(item.getAttribute('href'), true);
    });
});