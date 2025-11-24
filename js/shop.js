/* ===========================================
   SHOP MODULE JS - LUCESA (Versión optimizada)
   =========================================== */

/* ============================
   1. Verificar Sesión Activa
   ============================ */
document.addEventListener("DOMContentLoaded", () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const loginLink = document.querySelector(".nav-login");
  const registerLink = document.querySelector(".nav-register");
  const userMenuContainer = document.getElementById("userMenuContainer");

  if (userData && userMenuContainer) {
    if (loginLink) loginLink.style.display = "none";
    if (registerLink) registerLink.style.display = "none";

    userMenuContainer.innerHTML = `
      <div class="dropdown">
        <a class="btn btn-light dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
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
          <li><a class="dropdown-item" href="configuracion.html"><i class="fa fa-gear me-2 text-primary"></i>Configuración</a></li>
          <li><a class="dropdown-item" href="cambiar-clave.html"><i class="fa fa-lock me-2 text-primary"></i>Cambiar contraseña</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" id="logoutBtn"><i class="fa fa-sign-out-alt me-2"></i>Cerrar sesión</a></li>
        </ul>
      </div>
    `;

    document.getElementById("logoutBtn").addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("user");
      window.location.href = "index.html";
    });
  }
});

/* ============================
   2. Filtros de productos
   ============================ */
document.addEventListener("DOMContentLoaded", () => {
  const products = Array.from(document.querySelectorAll(".product-item"));
  const filterInputs = document.querySelectorAll("input[type=checkbox]");
  const searchInput = document.getElementById("searchInput");

  const groups = ["price", "color", "size", "gender", "brand"];

  groups.forEach(group => {
    const groupInputs = document.querySelectorAll(`input[id^='${group}-']`);
    groupInputs.forEach(input => {
      input.addEventListener("change", () => {
        if (input.checked)
          groupInputs.forEach(i => { if (i !== input) i.checked = false; });
        applyFilters();
      });
    });
  });

  function applyFilters() {
    const selected = {
      price: null,
      color: null,
      size: null,
      gender: null,
      brand: null
    };

    filterInputs.forEach(i => {
      if (i.checked) {
        const [type, val] = i.id.split("-");
        selected[type] = val.toLowerCase();
      }
    });

    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

    products.forEach(prod => {
      const price = parseInt(prod.dataset.price);
      const color = (prod.dataset.color || "").toLowerCase();
      const size = (prod.dataset.size || "").toLowerCase();
      const gender = (prod.dataset.gender || "").toLowerCase();
      const brand = (prod.dataset.brand || "").toLowerCase();
      const name = prod.querySelector("h6")?.textContent.toLowerCase() || "";

      let visible = true;

      if (selected.price && selected.price !== "all") {
        const ranges = {
          1: [0, 100000],
          2: [100000, 200000],
          3: [200000, 400000],
          4: [400000, 800000],
          5: [800000, Infinity]
        };
        const [min, max] = ranges[selected.price];
        visible = price >= min && price <= max;
      }

      if (selected.color !== "all" && selected.color) visible &&= color === selected.color;
      if (selected.size !== "all" && selected.size) visible &&= size === selected.size;
      if (selected.gender !== "all" && selected.gender) visible &&= gender === selected.gender;
      if (selected.brand !== "all" && selected.brand) visible &&= brand === selected.brand;

      if (query && visible) visible = name.includes(query);

      prod.style.display = visible ? "block" : "none";
    });
  }

  if (searchInput) searchInput.addEventListener("input", applyFilters);
  applyFilters();
});

/* ============================
   3. Clasificación
   ============================ */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".sort-option").forEach(option => {
    option.addEventListener("click", e => {
      e.preventDefault();
      const criteria = e.target.getAttribute("data-sort");
      const container = document.querySelector(".row.pb-3");

      const productCols = Array.from(
        container.querySelectorAll(".col-lg-4, .col-md-6, .col-sm-12")
      );

      productCols.sort((a, b) => {
        const priceA = parseFloat(a.querySelector(".product-item").dataset.price);
        const priceB = parseFloat(b.querySelector(".product-item").dataset.price);

        switch (criteria) {
          case "popular": return Math.random() - 0.5;
          case "best": return priceB - priceA;
          default: return 0;
        }
      });

      productCols.forEach(p => container.appendChild(p));

      document.getElementById("sortDropdown").textContent =
        `Clasificar Por: ${e.target.textContent}`;
    });
  });
});

/* ============================
   4. Carrito + Toast
   ============================ */
document.addEventListener("DOMContentLoaded", () => {
  const addToCartButtons = document.querySelectorAll(".btn-add-cart");
  const cartCountElement = document.querySelector(".cart-count");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function generateId(name, price, img) {
    return `${name}-${price}-${img}`.replace(/\W+/g, "_");
  }

  function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountElement) cartCountElement.textContent = total;
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

     // 🔥 Actualiza o recrea el bubble siempre que el carrito cambie
  if (window.updateCartBubble) window.updateCartBubble();

  }

  addToCartButtons.forEach(button => {
    button.addEventListener("click", e => {
      e.preventDefault();

      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        const warningToast = document.createElement("div");
        warningToast.className =
          "toast-login-warning position-fixed bottom-0 end-0 mb-4 me-4 bg-danger text-white px-4 py-3 rounded shadow-lg";
        warningToast.style.cursor = "pointer";
        warningToast.style.zIndex = "9999";
        warningToast.innerHTML =
          `<i class="fa fa-exclamation-triangle me-2"></i> Debes iniciar sesión para agregar productos. <u>Iniciar sesión</u>`;

        document.body.appendChild(warningToast);

        warningToast.addEventListener("click", () =>
          window.location.href = "auth/login.html"
        );

        setTimeout(() => {
          warningToast.style.transition = "opacity 0.5s ease";
          warningToast.style.opacity = "0";
          setTimeout(() => warningToast.remove(), 500);
        }, 4000);

        return; // ❗ NO AGREGA AL CARRITO
      }

      const card = button.closest(".product-item");
      const name = card.querySelector("h6").textContent.trim();
      const price = parseInt(card.dataset.price);
      const img = card.querySelector("img").src;
      const id = generateId(name, price, img);

      let existing = cart.find(i => i.id === id);
      if (existing) existing.quantity++;
      else cart.push({ id, name, price, img, quantity: 1 });

      saveCart();

      // === Toast elegante ===
      const toast = document.createElement("div");
      toast.className =
        "toast-add-cart position-fixed bottom-0 end-0 mb-4 me-4 bg-dark text-white px-4 py-3 rounded shadow-lg";
      toast.style.cursor = "pointer";
      toast.style.zIndex = "9999";
      toast.style.transition = "opacity 0.5s ease";
      toast.innerHTML =
        `<i class="fa fa-shopping-cart me-2 text-warning"></i><strong>${name}</strong> agregado al carrito (<u>Ver carrito</u>)`;

      document.body.appendChild(toast);

      toast.addEventListener("click", () => window.location.href = "cart.html");

      setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 500);
      }, 4000);
    });
  });

  updateCartCount();
});

/* ============================
   Bubble arrastrable (drag & click)
   Muestra la cantidad total del carrito
   ============================ */
(function () {
  // crea/actualiza bubble
  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }
  function getCartCount() {
    const cart = getCart();
    return cart.reduce((s, i) => s + (i.quantity || 0), 0);
  }

  function createOrUpdateBubble() {
    const count = getCartCount();
    let bubble = document.getElementById("cart-bubble");
    if (count <= 0) {
      if (bubble) bubble.remove();
      return;
    }

    if (!bubble) {
      bubble = document.createElement("div");
      bubble.id = "cart-bubble";
      bubble.style.position = "fixed";
      bubble.style.width = "70px";
      bubble.style.height = "70px";
      bubble.style.borderRadius = "50%";
      bubble.style.display = "flex";
      bubble.style.alignItems = "center";
      bubble.style.justifyContent = "center";
      bubble.style.boxShadow = "0 6px 18px rgba(0,0,0,0.25)";
      bubble.style.background = "#D19C97"; // conserva estilo primario
      bubble.style.color = "#fff";
      bubble.style.zIndex = "99999";
      bubble.style.cursor = "grab";
      bubble.style.userSelect = "none";
      bubble.style.touchAction = "none"; // para mejorar drag en touch
      bubble.style.fontWeight = "700";
      bubble.style.flexDirection = "column";
      bubble.innerHTML = `<i class="fa fa-shopping-cart" style="font-size:18px;"></i><div id="cart-bubble-count" style="font-size:13px; line-height:1;">0</div>`;

      // posición inicial (si se guardó una posición previa en localStorage la usamos)
      const pos = JSON.parse(localStorage.getItem("cartBubblePos") || "null");
      if (pos && typeof pos.x === "number" && typeof pos.y === "number") {
        bubble.style.left = pos.x + "px";
        bubble.style.top = pos.y + "px";
        bubble.style.bottom = "auto";
        bubble.style.right = "auto";
      } else {
        // default a bottom-right
        bubble.style.bottom = "25px";
        bubble.style.right = "25px";
      }

      document.body.appendChild(bubble);

      // handlers drag vs click (pointer events)
      attachPointerDragHandlers(bubble);
    }

    // actualizar contador dentro del bubble
    const cnt = document.getElementById("cart-bubble-count");
    if (cnt) cnt.textContent = `${count}`;

    // asegurar que sea visible
    bubble.style.display = "flex";
  }

  // Constrain dentro del viewport
  function clampPosition(x, y, w = 70, h = 70) {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const minX = 8;
    const minY = 8;
    const maxX = vw - w - 8;
    const maxY = vh - h - 8;
    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY)
    };
  }

  // Lógica de arrastre usando pointer events para mouse y touch
  function attachPointerDragHandlers(el) {
    let pointerDown = false;
    let startX = 0;
    let startY = 0;
    let origX = 0;
    let origY = 0;
    let isDragging = false;
    const clickThreshold = 6; // px, si mueve menos que esto se considera click

    // Helper: obtener left/top numéricos actuales (si no están, calculamos desde bottom/right)
    function getElPos() {
      const rect = el.getBoundingClientRect();
      // preferimos left/top
      return { left: rect.left, top: rect.top };
    }

    el.addEventListener("pointerdown", (ev) => {
      ev.preventDefault();
      el.setPointerCapture(ev.pointerId);
      pointerDown = true;
      isDragging = false;
      startX = ev.clientX;
      startY = ev.clientY;
      const pos = getElPos();
      origX = pos.left;
      origY = pos.top;
      el.style.transition = "none";
      el.style.cursor = "grabbing";
    });

    el.addEventListener("pointermove", (ev) => {
      if (!pointerDown) return;
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (!isDragging && (Math.abs(dx) > clickThreshold || Math.abs(dy) > clickThreshold)) {
        isDragging = true;
      }
      if (isDragging) {
        // calcular nueva posición y encuadrarla
        const newLeft = origX + dx;
        const newTop = origY + dy;
        const clamped = clampPosition(newLeft, newTop, el.offsetWidth, el.offsetHeight);
        el.style.left = clamped.x + "px";
        el.style.top = clamped.y + "px";
        el.style.bottom = "auto";
        el.style.right = "auto";
      }
    });

    el.addEventListener("pointerup", (ev) => {
      if (!pointerDown) return;
      el.releasePointerCapture(ev.pointerId);
      pointerDown = false;
      el.style.cursor = "grab";
      el.style.transition = "all 0.08s ease-out";

      // Si no fue dragging → click real → redirigir
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const moved = Math.sqrt(dx * dx + dy * dy);
      if (moved <= clickThreshold) {
        // click: redirige a carrito
        window.location.href = "cart.html";
        return;
      }

      // Si fue drag, guardamos posición (en left/top) para la próxima vez
      const pos = getElPos();
      localStorage.setItem("cartBubblePos", JSON.stringify({ x: pos.left, y: pos.top }));
    });

    // si el usuario cancela pointer (ej. touchcancel)
    el.addEventListener("pointercancel", (ev) => {
      pointerDown = false;
      el.style.cursor = "grab";
    });

    // Evitar el doble-click seleccionando texto, etc.
    el.addEventListener("dblclick", (e) => e.preventDefault());
  }

  // Observadores: actualiza bubble cuando cart cambia en esta página o en otras pestañas
  function initBubbleObservers() {
    // actualizar al cargar
    createOrUpdateBubble();

    // cuando cambie localStorage desde otra pestaña
    window.addEventListener("storage", (ev) => {
      if (ev.key === "cart" || ev.key === "user") {
        createOrUpdateBubble();
      }
    });

    // opcional: interceptar eventos personalizados para actualizar inmediatamente en la misma pestaña
    // (cuando tu código añade al carrito, puedes despachar: window.dispatchEvent(new Event('cart:updated')))
    window.addEventListener("cart:updated", () => createOrUpdateBubble());
  }

  // inicializamos cuando DOM listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBubbleObservers);
  } else {
    initBubbleObservers();
  }

  // Exponer una utilidad global para actualizar el bubble desde tu código después de manipular cart
  // --> llamar window.updateCartBubble() después de cambiar localStorage cart
  window.updateCartBubble = createOrUpdateBubble;
})();
