document.addEventListener("DOMContentLoaded", () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const loginLink = document.querySelector(".nav-login");
  const registerLink = document.querySelector(".nav-register");
  const userMenuContainer = document.getElementById("userMenuContainer");

  if (userData && userMenuContainer) {
    // Oculta los enlaces de login y registro
    if (loginLink) loginLink.style.display = "none";
    if (registerLink) registerLink.style.display = "none";

    // Inserta el menú de usuario con inicial redonda
    userMenuContainer.innerHTML = `
      <div class="dropdown">
        <a class="btn btn-light dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
               style="width:32px; height:32px; font-weight:600;">
            ${userData.name.charAt(0).toUpperCase()}
          </div>
          <span>${userData.name.split(" ")[0]}</span>
        </a>
        <ul class="dropdown-menu dropdown-menu-end shadow-sm animate__animated animate__fadeIn">
          <li><h6 class="dropdown-header">👋 Hola, ${userData.name.split(" ")[0]}</h6></li>
          <li><a class="dropdown-item" href="perfil.html"><i class="fa fa-user me-2 text-primary"></i>Mi perfil</a></li>
          <li><a class="dropdown-item" href="pedidos.html"><i class="fa fa-box me-2 text-primary"></i>Mis pedidos</a></li>
          <li><a class="dropdown-item" href="pagos.html"><i class="fa fa-credit-card me-2 text-primary"></i>Métodos de pago</a></li>
          <li><a class="dropdown-item" href="configuracion.html"><i class="fa-solid fa-gear me-2 text-primary"></i>Configuración</a></li>
          <li><a class="dropdown-item" href="cambiar-clave.html"><i class="fa fa-lock me-2 text-primary"></i>Cambiar contraseña</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" id="logoutBtn"><i class="fa fa-sign-out-alt me-2"></i>Cerrar sesión</a></li>
        </ul>
      </div>
    `;

    // Evento para cerrar sesión
    document.getElementById("logoutBtn").addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("user");
      window.location.reload();
    });
  }
});
