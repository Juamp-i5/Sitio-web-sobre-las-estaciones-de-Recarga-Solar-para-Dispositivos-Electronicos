// script.js

/**
 * Configura el desplazamiento suave para todos los enlaces de anclaje (href="#...")
 * También cierra el menú móvil si está abierto antes de desplazarse.
 */
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault(); // Previene el comportamiento de anclaje predeterminado
      const targetId = this.getAttribute("href");
      try {
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          // Cierra el menú móvil antes de desplazarse
          const mobileMenu = document.getElementById("mobile-menu");
          if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
            mobileMenu.classList.add("hidden");
          }

          // Realiza el desplazamiento suave hacia el elemento de destino
          targetElement.scrollIntoView({
            behavior: "smooth", // Habilita la animación de desplazamiento suave
          });
        } else {
          console.warn(
            `Smooth scroll target not found for selector: ${targetId}`
          );
        }
      } catch (error) {
        // Captura errores si el selector es inválido
        console.error(`Error finding smooth scroll target: ${targetId}`, error);
      }
    });
  });
}

/**
 * Inicializa la funcionalidad del menú móvil (botón hamburguesa).
 */
function setupMobileMenu() {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      // Alterna la clase 'hidden' para mostrar/ocultar el menú
      mobileMenu.classList.toggle("hidden");
    });
  } else {
    console.warn("Mobile menu button or menu element not found.");
  }
}

/**
 * Inicializa la funcionalidad del carrusel de imágenes.
 */
function setupImageSlideshow() {
  const slides = document.querySelectorAll(
    ".slideshow-container .slideshow-image"
  );
  if (slides.length > 0) {
    let currentSlide = 0;
    const slideInterval = 4000; // Intervalo de cambio en milisegundos (4 segundos)

    // Función para pasar a la siguiente diapositiva
    function nextSlide() {
      slides[currentSlide].classList.remove("active"); // Oculta la diapositiva actual
      currentSlide = (currentSlide + 1) % slides.length; // Calcula el índice de la siguiente diapositiva (circular)
      slides[currentSlide].classList.add("active"); // Muestra la nueva diapositiva
    }

    slides[0].classList.add("active"); // Muestra la primera imagen inicialmente
    setInterval(nextSlide, slideInterval); // Inicia el intervalo para cambiar automáticamente las diapositivas
  } else {
    console.warn("No slides found for the slideshow.");
  }
}

/**
 * Inicializa el mapa Leaflet con marcadores para las estaciones solares.
 */
function setupLeafletMap() {
  const mapElement = document.getElementById("map");
  if (mapElement) {
    // Coordenadas y zoom iniciales para el mapa (Centrado en ITSON Nainari aprox.)
    const initialView = [27.492798, -109.971042]; // Ajusta estas coordenadas si es necesario
    const initialZoom = 17; // Nivel de zoom (más alto = más cerca)

    // Coordenadas de las estaciones solares (Ejemplos)
    const solarStations = [
      {
        coords: [27.493954, -109.972144],
        popup: "<b>ITSON Campus Nainari</b><br>Estación 1800.",
      },
      {
        coords: [27.492165, -109.97198],
        popup: "<b>ITSON Campus Nainari</b><br>Estación canchas de tenis.",
      },
      {
        coords: [27.49216, -109.970768],
        popup: "<b>ITSON Campus Nainari</b><br>Estación explanada.",
      },
    ];

    // Usar un pequeño retraso con setTimeout para asegurar que el contenedor del mapa
    // sea completamente renderizado y tenga dimensiones antes de inicializar Leaflet.
    setTimeout(() => {
      try {
        // Crea la instancia del mapa y la asocia con el div 'map'
        const map = L.map("map").setView(initialView, initialZoom);

        // Añade la capa de teselas (mapa base) de OpenStreetMap
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19, // Zoom máximo permitido por la capa de teselas
          // Créditos requeridos por OpenStreetMap
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map); // Añade la capa al mapa

        // Añade marcadores para cada estación solar
        solarStations.forEach((station, index) => {
          const marker = L.marker(station.coords)
            .addTo(map) // Añade el marcador al mapa
            .bindPopup(station.popup); // Asocia un popup al marcador

          // Abre el popup del primer marcador por defecto
          if (index === 0) {
            marker.openPopup();
          }
        });

        // ** Importante para la responsividad del mapa **
        // Observa cambios en el tamaño del contenedor del mapa y ajusta el tamaño del mapa.
        const resizeObserver = new ResizeObserver(() => {
          map.invalidateSize(); // Recalcula el tamaño del mapa
        });
        resizeObserver.observe(mapElement); // Comienza a observar el elemento del mapa
      } catch (error) {
        // Captura cualquier error durante la inicialización del mapa
        console.error("Error initializing Leaflet map:", error);
        // Muestra un mensaje de error en lugar del mapa si falla la inicialización
        mapElement.innerHTML =
          '<p class="text-red-500 text-center p-4">Error al cargar el mapa. Intenta recargar la página.</p>';
      }
    }, 100); // Retraso de 100ms
  } else {
    // Advierte si no se encuentra el elemento del mapa en el DOM
    console.warn("Map element with ID 'map' not found.");
  }
}

/**
 * Inicializa la funcionalidad de acordeón para la sección FAQ con animación.
 */
function setupFaqAccordion() {
  // Selecciona todos los botones de pregunta
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((button) => {
    button.addEventListener("click", () => {
      // Encuentra el div de respuesta asociado (hermano siguiente del botón)
      const answer = button.nextElementSibling;
      // Encuentra el indicador +/- dentro del botón
      const indicator = button.querySelector(".faq-indicator");

      if (answer && answer.classList.contains("faq-answer")) {
        // **MODIFICADO:** Alterna la clase para la animación CSS en lugar de 'hidden'
        const isVisible = answer.classList.toggle("faq-answer-visible");

        // Cambia el indicador +/-
        if (isVisible) {
          indicator.textContent = "-";
          // Opcional: Rotar el indicador
          // indicator.style.transform = 'rotate(45deg)';
        } else {
          indicator.textContent = "+";
          // Opcional: Resetear rotación
          // indicator.style.transform = 'rotate(0deg)';
        }

        // Opcional: Cerrar otras respuestas abiertas (acordeón clásico)
        faqQuestions.forEach((otherButton) => {
          if (otherButton !== button) {
            const otherAnswer = otherButton.nextElementSibling;
            const otherIndicator = otherButton.querySelector(".faq-indicator");
            if (
              otherAnswer &&
              otherAnswer.classList.contains("faq-answer-visible")
            ) {
              otherAnswer.classList.remove("faq-answer-visible");
              if (otherIndicator) otherIndicator.textContent = "+";
            }
          }
        });
      } else {
        console.warn(
          "FAQ answer element not found immediately after the button:",
          button
        );
      }
    });
  });
}

// --- Ejecución Principal ---
// Espera a que el contenido del DOM esté completamente cargado y parseado
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed."); // Mensaje de depuración
  setupSmoothScrolling(); // Configura el desplazamiento suave
  setupMobileMenu(); // Configura el menú móvil
  setupImageSlideshow(); // Configura el carrusel de imágenes
  setupLeafletMap(); // Configura el mapa Leaflet
  setupFaqAccordion(); // Configura el acordeón de FAQ (con animación)
});

// Puedes añadir más funcionalidades JavaScript aquí si es necesario
