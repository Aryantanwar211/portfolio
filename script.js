const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#navMenu");
const cursorGlow = document.querySelector("#cursorGlow");
const pageLoader = document.querySelector("#pageLoader");
const typingText = document.querySelector("#typingText");
const resumeDownload = document.querySelector("#resumeDownload");
const contactForm = document.querySelector("[data-contact-form]");
const toast = document.querySelector("#toast");
const currentYear = document.querySelector("#currentYear");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const typingPhrases = [
  "Web Developer",
  "Frontend Builder",
  "UI-Focused Coder",
  "JavaScript Learner"
];

let toastTimer;

// Loader exits after the first paint so the portfolio opens with a clean reveal.
window.addEventListener("load", () => {
  window.setTimeout(() => {
    pageLoader.classList.add("is-hidden");
  }, 450);
});

currentYear.textContent = new Date().getFullYear();

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");

  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 3600);
}

function updateHeaderState() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

function closeMobileMenu() {
  navToggle.setAttribute("aria-expanded", "false");
  navMenu.classList.remove("is-open");
}

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navMenu.classList.toggle("is-open", !isOpen);
});

navMenu.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    closeMobileMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
});

// The glow follows pointer position without blocking clicks or keyboard usage.
document.addEventListener(
  "pointermove",
  (event) => {
    cursorGlow.style.setProperty("--glow-x", `${event.clientX}px`);
    cursorGlow.style.setProperty("--glow-y", `${event.clientY}px`);
  },
  { passive: true }
);

function runTypingEffect() {
  if (prefersReducedMotion || !typingText) {
    typingText.textContent = typingPhrases[0];
    return;
  }

  let phraseIndex = 0;
  let characterIndex = 0;
  let isDeleting = false;

  function type() {
    const phrase = typingPhrases[phraseIndex];
    typingText.textContent = phrase.slice(0, characterIndex);

    if (!isDeleting && characterIndex < phrase.length) {
      characterIndex += 1;
      window.setTimeout(type, 72);
      return;
    }

    if (!isDeleting && characterIndex === phrase.length) {
      isDeleting = true;
      window.setTimeout(type, 1200);
      return;
    }

    if (isDeleting && characterIndex > 0) {
      characterIndex -= 1;
      window.setTimeout(type, 42);
      return;
    }

    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % typingPhrases.length;
    window.setTimeout(type, 240);
  }

  type();
}

runTypingEffect();

const revealElements = document.querySelectorAll(".reveal");
const skillBars = document.querySelectorAll(".skill-progress");

function fillSkillBar(bar) {
  bar.style.width = `${bar.dataset.level}%`;
  bar.classList.add("is-filled");
}

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fillSkillBar(entry.target);
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.55 }
  );

  skillBars.forEach((bar) => skillObserver.observe(bar));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
  skillBars.forEach(fillSkillBar);
}

// Active nav state is based on the section closest to the top of the viewport.
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

function updateActiveNav() {
  const currentSection = [...sections]
    .filter((section) => section.getBoundingClientRect().top <= 160)
    .pop();

  navLinks.forEach((link) => {
    link.classList.toggle(
      "is-active",
      Boolean(currentSection && link.getAttribute("href") === `#${currentSection.id}`)
    );
  });
}

updateActiveNav();
window.addEventListener("scroll", updateActiveNav, { passive: true });

// Resume Download Button Toast
resumeDownload.addEventListener("click", () => {
  showToast("Resume downloading...");
});

// Contact Form Submit Handler
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  const formData = new FormData(contactForm);
  const name = formData.get("name").trim();
  const email = formData.get("email").trim();
  const message = formData.get("message").trim();
  const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);

  showToast("Opening your email app with the message ready.");
  window.setTimeout(() => {
    // Updated Email ID here
    window.location.href = `mailto:aryantanwar211@gmail.com?subject=${subject}&body=${body}`;
    contactForm.reset();
  }, 420);
});