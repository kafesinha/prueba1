/* ===========================
   tuBazar — Lógica principal
   carrito, navegación, render
   =========================== */

const CART_KEY = "tubazar_carrito";

/* ---------- Carrito: almacenamiento ---------- */
function leerCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem(CART_KEY, JSON.stringify(carrito));
  actualizarContador();
}

function agregarAlCarrito(id, cantidad = 1, talla = null) {
  const producto = obtenerProducto(id);
  if (!producto) return;
  const carrito = leerCarrito();
  const existente = carrito.find((i) => i.id === id && i.talla === talla);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({ id, cantidad, talla });
  }
  guardarCarrito(carrito);
  mostrarToast(`<strong>${producto.nombre}</strong> añadido al carrito`);
}

function eliminarDelCarrito(index) {
  const carrito = leerCarrito();
  carrito.splice(index, 1);
  guardarCarrito(carrito);
  renderCarrito();
}

function cambiarCantidad(index, delta) {
  const carrito = leerCarrito();
  if (!carrito[index]) return;
  carrito[index].cantidad += delta;
  if (carrito[index].cantidad < 1) carrito[index].cantidad = 1;
  guardarCarrito(carrito);
  renderCarrito();
}

function contarItems() {
  return leerCarrito().reduce((sum, i) => sum + i.cantidad, 0);
}

function actualizarContador() {
  const total = contarItems();
  document.querySelectorAll(".carrito-contador").forEach((el) => {
    el.textContent = total;
    el.style.display = total > 0 ? "inline-flex" : "none";
  });
}

/* ---------- Toast de notificación ---------- */
let toastTimer;
function mostrarToast(mensaje) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = mensaje;
  requestAnimationFrame(() => toast.classList.add("visible"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2600);
}

/* ---------- Navegación móvil ---------- */
function initNav() {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("abierto"));
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("abierto"))
    );
  }
}

/* ---------- Render: tarjeta de producto ---------- */
function tarjetaProducto(p) {
  return `
    <article class="producto-card">
      <div class="producto-media">
        ${p.etiqueta ? `<span class="producto-etiqueta">${p.etiqueta}</span>` : ""}
        <a href="producto.html?id=${p.id}">
          <img src="${p.img}" alt="${p.nombre}" loading="lazy">
        </a>
      </div>
      <div class="producto-info">
        <span class="producto-categoria">${p.categoria}</span>
        <h3 class="producto-nombre"><a href="producto.html?id=${p.id}">${p.nombre}</a></h3>
        <span class="producto-precio">${formatearPrecio(p.precio)}</span>
        <div class="producto-acciones">
          <button class="btn btn-dorado" onclick="agregarAlCarrito(${p.id})">Agregar</button>
        </div>
      </div>
    </article>`;
}

/* ---------- Render: destacados (inicio) ---------- */
function renderDestacados() {
  const cont = document.getElementById("destacados");
  if (!cont) return;
  cont.innerHTML = PRODUCTOS.slice(0, 4).map(tarjetaProducto).join("");
}

/* ---------- Render: tienda con filtros ---------- */
let filtroActual = "Todos";
let ordenActual = "destacado";

function renderTienda() {
  const cont = document.getElementById("grid-tienda");
  if (!cont) return;

  let lista = [...PRODUCTOS];
  if (filtroActual !== "Todos") {
    lista = lista.filter((p) => p.categoria === filtroActual);
  }
  if (ordenActual === "precio-asc") lista.sort((a, b) => a.precio - b.precio);
  if (ordenActual === "precio-desc") lista.sort((a, b) => b.precio - a.precio);
  if (ordenActual === "nombre") lista.sort((a, b) => a.nombre.localeCompare(b.nombre));

  cont.innerHTML = lista.length
    ? lista.map(tarjetaProducto).join("")
    : `<p style="color:var(--gris)">No hay productos en esta categoría.</p>`;

  const conteo = document.getElementById("conteo-productos");
  if (conteo) conteo.textContent = `${lista.length} producto${lista.length !== 1 ? "s" : ""}`;
}

function initTienda() {
  const cont = document.getElementById("grid-tienda");
  if (!cont) return;

  // construir filtros dinámicamente
  const categorias = ["Todos", ...new Set(PRODUCTOS.map((p) => p.categoria))];
  const listaFiltros = document.getElementById("lista-filtros");
  if (listaFiltros) {
    listaFiltros.innerHTML = categorias
      .map(
        (c) =>
          `<li><button class="filtro-btn ${c === "Todos" ? "activo" : ""}" data-cat="${c}">${c}</button></li>`
      )
      .join("");
    listaFiltros.querySelectorAll(".filtro-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        filtroActual = btn.dataset.cat;
        listaFiltros.querySelectorAll(".filtro-btn").forEach((b) => b.classList.remove("activo"));
        btn.classList.add("activo");
        renderTienda();
      });
    });
  }

  const orden = document.getElementById("orden");
  if (orden) {
    orden.addEventListener("change", () => {
      ordenActual = orden.value;
      renderTienda();
    });
  }

  // preseleccionar categoría desde la URL (?cat=)
  const params = new URLSearchParams(location.search);
  const cat = params.get("cat");
  if (cat && categorias.includes(cat)) {
    filtroActual = cat;
    listaFiltros?.querySelectorAll(".filtro-btn").forEach((b) => {
      b.classList.toggle("activo", b.dataset.cat === cat);
    });
  }

  renderTienda();
}

/* ---------- Render: detalle de producto ---------- */
let tallaSeleccionada = null;

function initDetalle() {
  const cont = document.getElementById("detalle-producto");
  if (!cont) return;

  const params = new URLSearchParams(location.search);
  const producto = obtenerProducto(params.get("id")) || PRODUCTOS[0];
  document.title = `${producto.nombre} — tuBazar`;
  tallaSeleccionada = producto.tallas[0];

  cont.innerHTML = `
    <div class="detalle-media">
      <img src="${producto.img}" alt="${producto.nombre}">
    </div>
    <div class="detalle-info">
      <span class="producto-categoria">${producto.categoria}</span>
      <h1>${producto.nombre}</h1>
      <p class="detalle-precio">${formatearPrecio(producto.precio)}</p>
      <p class="detalle-descripcion">${producto.descripcion}</p>
      <div class="detalle-bloque">
        <h4>Talla</h4>
        <div class="tallas">
          ${producto.tallas
            .map(
              (t, i) =>
                `<button class="talla-btn ${i === 0 ? "activo" : ""}" data-talla="${t}">${t}</button>`
            )
            .join("")}
        </div>
      </div>
      <div class="detalle-acciones">
        <button class="btn btn-dorado" id="btn-agregar-detalle">Agregar al carrito</button>
        <a href="tienda.html" class="btn btn-outline">Seguir comprando</a>
      </div>
      <div class="detalle-extra">
        <div><span>✓</span><div><strong>Envío gratis</strong> en pedidos superiores a $150</div></div>
        <div><span>✓</span><div><strong>Devolución sencilla</strong> hasta 30 días</div></div>
        <div><span>✓</span><div><strong>Pago seguro</strong> con cifrado garantizado</div></div>
      </div>
    </div>`;

  cont.querySelectorAll(".talla-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      cont.querySelectorAll(".talla-btn").forEach((b) => b.classList.remove("activo"));
      btn.classList.add("activo");
      tallaSeleccionada = btn.dataset.talla;
    });
  });

  document.getElementById("btn-agregar-detalle").addEventListener("click", () => {
    agregarAlCarrito(producto.id, 1, tallaSeleccionada);
  });

  // relacionados
  const rel = document.getElementById("relacionados");
  if (rel) {
    const otros = PRODUCTOS.filter((p) => p.id !== producto.id).slice(0, 4);
    rel.innerHTML = otros.map(tarjetaProducto).join("");
  }
}

/* ---------- Render: carrito ---------- */
function renderCarrito() {
  const cont = document.getElementById("carrito-contenido");
  if (!cont) return;

  const carrito = leerCarrito();

  if (carrito.length === 0) {
    cont.innerHTML = `
      <div class="carrito-vacio">
        <h3>Tu carrito está vacío</h3>
        <p>Descubre nuestra colección y encuentra tus piezas favoritas.</p>
        <a href="tienda.html" class="btn btn-dorado">Ir a la tienda</a>
      </div>`;
    return;
  }

  let subtotal = 0;
  const itemsHTML = carrito
    .map((item, index) => {
      const p = obtenerProducto(item.id);
      if (!p) return "";
      const totalItem = p.precio * item.cantidad;
      subtotal += totalItem;
      return `
        <div class="carrito-item">
          <img src="${p.img}" alt="${p.nombre}">
          <div class="carrito-item-info">
            <span class="producto-categoria">${p.categoria}${item.talla ? " · Talla " + item.talla : ""}</span>
            <h4>${p.nombre}</h4>
            <span class="carrito-item-precio">${formatearPrecio(p.precio)}</span>
            <div class="cantidad-control">
              <button onclick="cambiarCantidad(${index}, -1)" aria-label="Reducir">−</button>
              <span>${item.cantidad}</span>
              <button onclick="cambiarCantidad(${index}, 1)" aria-label="Aumentar">+</button>
            </div>
          </div>
          <div class="carrito-item-final">
            <span class="carrito-item-total">${formatearPrecio(totalItem)}</span>
            <button class="eliminar-btn" onclick="eliminarDelCarrito(${index})">Eliminar</button>
          </div>
        </div>`;
    })
    .join("");

  const envio = subtotal >= 150 || subtotal === 0 ? 0 : 9.9;
  const total = subtotal + envio;

  cont.innerHTML = `
    <div class="carrito-layout">
      <div class="carrito-items">${itemsHTML}</div>
      <aside class="resumen">
        <h3>Resumen</h3>
        <div class="resumen-linea"><span>Subtotal</span><span>${formatearPrecio(subtotal)}</span></div>
        <div class="resumen-linea"><span>Envío</span><span>${envio === 0 ? "Gratis" : formatearPrecio(envio)}</span></div>
        <div class="resumen-total"><span>Total</span><span>${formatearPrecio(total)}</span></div>
        <button class="btn btn-dorado btn-bloque" onclick="finalizarCompra()">Finalizar compra</button>
        <a href="tienda.html" class="btn btn-outline btn-bloque" style="margin-top:12px">Seguir comprando</a>
      </aside>
    </div>`;
}

function finalizarCompra() {
  if (leerCarrito().length === 0) return;
  guardarCarrito([]);
  renderCarrito();
  mostrarToast("<strong>¡Gracias por tu compra!</strong> Pedido confirmado.");
}

/* ---------- Formularios ---------- */
function initFormularios() {
  document.querySelectorAll("form[data-feedback]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = form.querySelector(".mensaje-ok");
      if (msg) msg.classList.add("visible");
      form.reset();
      setTimeout(() => msg && msg.classList.remove("visible"), 4000);
    });
  });
}

/* ---------- Año footer ---------- */
function initAnio() {
  document.querySelectorAll(".anio").forEach((el) => (el.textContent = new Date().getFullYear()));
}

/* ---------- Init global ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  actualizarContador();
  renderDestacados();
  initTienda();
  initDetalle();
  renderCarrito();
  initFormularios();
  initAnio();
});
