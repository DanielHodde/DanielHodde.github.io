function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
  }

document.addEventListener("DOMContentLoaded", function () {
  const faders = document.querySelectorAll('.fade-in');

  const appearOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver(function (
    entries,
    appearOnScroll
  ) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add 'visible' when the element enters the viewport
        entry.target.classList.add("visible");
        entry.target.classList.remove("hidden");
      } else {
        // Add 'hidden' when the element leaves the viewport
        entry.target.classList.remove("visible");
        entry.target.classList.add("hidden");
      }
    });
  },
  appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });
});

window.addEventListener("load", function() {
  const typewriterElement = document.querySelector('.visible-text');
  
  // Add the 'start-typing' class to begin the animation
  setTimeout(() => {
    typewriterElement.classList.add('start-typing');
  }, 100);  // Small delay to ensure everything is loaded

  // Remove the cursor after typing is complete
  setTimeout(() => {
    typewriterElement.classList.add('finished'); // Adds 'finished' class to stop cursor blink
  }, 1500); // Match the duration of the typing animation
});
