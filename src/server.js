import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { Router } = express;
import {
  productosDao as productosApi,
  carritosDao as carritosApi,
} from "./daos/index.js";

const app = express();

const productosRouter = new Router();

productosRouter.get("/", async (req, res) => {
  if (req.query.admin) {
    res.render("productosAdmin", { data: await productosApi.mostrarTodos() });
  } else {
    // ARREGLAR CUANDO NO HAR CARRITOS CARGADOS
    let carritos = await carritosApi.mostrarTodos();
    let param
    if (carritos.length > 0) {
      let carrito = carritos[carritos.length - 1].id
      param = "carritos/"+ carrito + "/productos"
    } else {
      param = '#'
    }
    
    res.render("productos", {
      data: await productosApi.mostrarTodos(),
      nroC: param,
    });
  }
});

productosRouter.get("/:id", async (req, res) => {
  res.json(await productosApi.mostrar(req.params.id));
});

// PARA ACCEDER USAR QUERY PARAMS ADMIN=TRUE

productosRouter.post("/", async (req, res) => {
  if (req.query.admin) {
    const obj = req.body;
    let productoNuevo = {
      ...obj,
      timestamp: Date.now(),
      codigo: obj.nombre.toLowerCase().replace(/\s/, "-"),
    };
    res.render("uploaded", {
      data: await productosApi.guardar(productoNuevo),
    });
  } else {
    res.send({ error: "permiso denegado" });
  }
});

productosRouter.put("/:id", async (req, res) => {
  if (req.query.admin) {
    let newProd = {
      ...req.body,
      timestamp: Date.now(),
      codigo: (req.body.nombre + req.params.id).toLowerCase().replace(/\s/, "-"),
    };
    res.render("uploaded", { data: await productosApi.actualizar(newProd) });
  } else {
    res.send({ error: "permiso denegado" });
  }
});

productosRouter.delete("/:id", async (req, res) => {
  if (req.query.admin) {
    await productosApi.borrar(req.params.id);
    res.send({ delete: "ok", id: req.params.id });
  } else {
    res.send({
      error: -1,
      descripcion: "ruta '/api/productos' método 'DELETE' no autorizada",
    });
  }
});

const carritoRouter = new Router();

carritoRouter.get("/:id/productos", async (req, res) => {
  res.render('carrito', {data: await carritosApi.mostrar(req.params.id), idC: req.params.id})
});

carritoRouter.post("/:id/productos", async (req, res) => {
  const carrito = await carritosApi.listar(req.params.id);
  const producto = await productosApi.listar(req.body.id);
  carrito.productos.push(producto);
  await carritosApi.actualizar(carrito);
  res.send({ message: `Producto agregado, id: ${req.body.id}` });
});

carritoRouter.post("/", async (req, res) => {
  let obj = {
    timestamp: Date.now(),
    productos: [],
  };
  res.send({
    message: `Carrito creado, id: ${(await carritosApi.guardar(obj)).id}`,
  });
});

carritoRouter.delete("/:id", async (req, res) => {
  let id = Number.parseInt(req.params.id);
  await carritosApi.borrar(id);
  res.send({ delete: "ok", id: id });
});

carritoRouter.delete("/:id/productos/:id_prod", async (req, res) => {
  const carrito = await carritosApi.listar(req.params.id);
  const index = carrito.productos.findIndex((p) => p.id == req.params.idProd);
  if (index != -1) {
    carrito.productos.splice(index, 1);
    await carritosApi.actualizar(carrito);
  }
  res.send({ message: `Producto con ID ${idP} eliminado.` });
});

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/productos", productosRouter);
app.use("/api/carritos", carritoRouter);

app.get("/", async (req, res) => {
  res.render("index", { data: await productosApi.mostrarTodos() });
});

export default app;
