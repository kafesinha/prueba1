/* ===========================
   tuBazar — Catálogo de productos
   =========================== */

const PRODUCTOS = [
  {
    id: 1,
    nombre: "Abrigo Camel",
    categoria: "Abrigos",
    precio: 189.0,
    img: "assets/img/abrigo.png",
    etiqueta: "Nuevo",
    descripcion:
      "Abrigo largo de lana en tono camel, corte recto y solapa clásica. Una pieza atemporal que aporta sofisticación a cualquier conjunto de temporada fría.",
    tallas: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 2,
    nombre: "Vestido Noir",
    categoria: "Vestidos",
    precio: 145.0,
    img: "assets/img/vestido.png",
    etiqueta: "Destacado",
    descripcion:
      "Vestido negro minimalista de líneas depuradas, confeccionado en tejido fluido. Perfecto para ocasiones especiales o un look elegante de oficina.",
    tallas: ["XS", "S", "M", "L"],
  },
  {
    id: 3,
    nombre: "Camisa Lino Blanca",
    categoria: "Camisas",
    precio: 79.0,
    img: "assets/img/camisa.png",
    etiqueta: null,
    descripcion:
      "Camisa de lino 100% natural en blanco puro. Transpirable, ligera y versátil, ideal para combinar en cualquier estación del año.",
    tallas: ["S", "M", "L", "XL"],
  },
  {
    id: 4,
    nombre: "Pantalón Sastre",
    categoria: "Pantalones",
    precio: 98.0,
    img: "assets/img/pantalon.png",
    etiqueta: null,
    descripcion:
      "Pantalón de vestir en gris marengo con corte sastre y caída impecable. Confeccionado para ofrecer comodidad sin renunciar a la elegancia.",
    tallas: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 5,
    nombre: "Bolso Cuero Negro",
    categoria: "Accesorios",
    precio: 129.0,
    img: "assets/img/bolso.png",
    etiqueta: "Edición limitada",
    descripcion:
      "Bolso de cuero genuino con herrajes dorados y acabado pulido. Un accesorio de lujo que combina funcionalidad y diseño contemporáneo.",
    tallas: ["Única"],
  },
  {
    id: 6,
    nombre: "Zapatos Tacón Negro",
    categoria: "Calzado",
    precio: 112.0,
    img: "assets/img/zapatos.png",
    etiqueta: null,
    descripcion:
      "Zapatos de tacón en cuero negro con diseño estilizado y sólido confort. La elección perfecta para elevar cualquier conjunto.",
    tallas: ["36", "37", "38", "39", "40"],
  },
  {
    id: 7,
    nombre: "Suéter Cashmere",
    categoria: "Punto",
    precio: 134.0,
    img: "assets/img/sueter.png",
    etiqueta: "Nuevo",
    descripcion:
      "Suéter de cashmere en tono beige, de tacto suave y abrigado. Tejido de punto fino que aporta calidez y un aire refinado y casual.",
    tallas: ["S", "M", "L", "XL"],
  },
  {
    id: 8,
    nombre: "Trench Editorial",
    categoria: "Abrigos",
    precio: 215.0,
    img: "assets/img/hero.png",
    etiqueta: "Destacado",
    descripcion:
      "Trench de inspiración editorial con cinturón ajustable y silueta envolvente. La declaración de estilo definitiva para la temporada.",
    tallas: ["XS", "S", "M", "L"],
  },
];

function formatearPrecio(valor) {
  return "$" + valor.toFixed(2);
}

function obtenerProducto(id) {
  return PRODUCTOS.find((p) => p.id === Number(id));
}
