document.addEventListener('DOMContentLoaded', function () {
  var sections = document.querySelectorAll('section');
  var navLinks = document.querySelectorAll('#Options a');

  function isSectionInViewport(section) {
    var rect = section.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0
    );
  }

  function updateActiveLink() {
    sections.forEach(function (section, index) {
      if (isSectionInViewport(section) && section.className != 'active') {
        // Remueve la clase 'active' de todos los enlaces
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          link.classList.add('inactive');
        });

        // Agrega la clase 'active' al enlace correspondiente
        navLinks[index].classList.remove('inactive');
        navLinks[index].classList.add('active');
      }
    });
  }

  // Agrega un event listener para el evento de scroll
  window.addEventListener('scroll', function () {
    updateActiveLink();
  });

  // Llama a la función al cargar la página para inicializar la clase activa
  updateActiveLink();

  // Obtén todos los enlaces de la lista de opciones
  var navLinks = document.querySelectorAll('#Options a');

  // Agrega un event listener a cada enlace
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      // Evita el comportamiento predeterminado del enlace
      event.preventDefault();

      // Obtiene el atributo href para encontrar el elemento destino
      var targetId = link.getAttribute('href').substring(1);
      var targetElement = document.getElementById(targetId);

      // Ajusta la posición de desplazamiento para que la sección sea visible
      var headerHeight = document.querySelector('header').offsetHeight; // Ajusta 'header' al selector correcto de tu encabezado
      var targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

      // Hace scroll hacia el elemento destino con la posición ajustada
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
});
