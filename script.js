document.addEventListener("DOMContentLoaded", () => {
  updateYear();

  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    // Función para actualizar el estado del menú
    const updateMenuState = (isOpen) => {
      if (isOpen) {
        navLinks.classList.add("active");
        navLinks.style.display = "flex";
        menuToggle.innerHTML = "&times;";
        menuToggle.setAttribute("aria-label", "Cerrar menú");
      } else {
        navLinks.classList.remove("active");
        navLinks.style.display = "none";
        menuToggle.innerHTML = "☰";
        menuToggle.setAttribute("aria-label", "Abrir menú");
      }
    };

    // Evento click en el botón del menú
    menuToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = !navLinks.classList.contains("active");
      updateMenuState(isOpen);
    });

    // Cerrar menú al hacer click en un enlace
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        updateMenuState(false);
      });
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener("click", (event) => {
      const isClickInside =
        navLinks.contains(event.target) || menuToggle.contains(event.target);

      if (!isClickInside) {
        updateMenuState(false);
      }
    });
  }
});

function updateYear() {
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}
