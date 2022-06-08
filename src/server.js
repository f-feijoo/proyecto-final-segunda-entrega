import express from "express";
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
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
    let carrito = 1;
    res.render("productos", {
      data: await productosApi.mostrarTodos(),
      nroC: "carrito/" + carrito + "/productos",
    });
  }
});

productosRouter.get("/:id", async (req, res) => {
  res.json(await productosApi.mostrar(req.params.id));
});

productosRouter.post("/", async (req, res) => {
    console.log(req.body)
  if (req.query.admin) {
    const obj = req.body;
    let productoNuevo = {
      ...obj,
      timestamp: Date.now(),
      codigo: obj.nombre.toLowerCase().replace(/\s/, "-"),
    };
    console.log('cargado');
    res.render("productosAdmin", {
      data: await productosApi.guardar(productoNuevo)
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
      codigo: (req.body.nombre + id).toLowerCase().replace(/\s/, "-"),
    };
    await productosApi.actualizar(newProd);
    res.render("uploaded", { data: newProd });
  } else {
    res.send({ error: "permiso denegado" });
  }
});

productosRouter.delete("/:id", async (req, res) => {
  if (req.query.admin) {
    await productosApi.borrar(req.params.id)
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
  // fs.readFile(`./carrito.json`, 'utf-8', (err, data) => {
  //     if (err) {
  //         return({message: 'Error en la consulta'})
  //     }else{
  //         let obj = JSON.parse(data)
  //         let ide = req.params.id
  //         let resp = obj.find(x => x.id == ide)
  //         if(resp) {
  //             res.render('carrito', {data: resp, idC: ide})
  //         } else {
  //             res.send({ error : 'carrito no encontrado' })
  //         }
  //     }
  // })
});

carritoRouter.post("/:id/productos", async (req, res) => {
  // fs.readFile(`./productos.json`, 'utf-8', (err, data) => {
  //     if (err) {
  //         res.send({message: 'Error en la consulta'})
  //     }else{
  //         let obj = JSON.parse(data)
  //         let ide = req.params.id
  //         let resp = obj.find(x => x.id == ide)
  //         if(resp) {
  //             fs.readFile(`./carrito.json`, 'utf-8', (err, data) => {
  //                 if (err) {
  //                     return({message: 'Error en la consulta'})
  //                 }else{
  //                     let carr = JSON.parse(data)
  //                     carr[carr.length-1]['productos'].push(resp)
  //                     fs.writeFile('./carrito.json', JSON.stringify(carr), 'utf-8', (err) => {
  //                         if(err){
  //                             return 'Error al escribir'
  //                         } else {
  //                            res.send({message: `Producto agregado, id: ${resp.id}`})
  //                         }
  //                     } )
  //                 }
  //             })
  //         } else {
  //             res.send({ error : 'producto no encontrado' })
  //         }
  //     }
  // })
});

carritoRouter.post("/", async (req, res) => {
  // fs.readFile(`./carrito.json`, 'utf-8', (err, data) => {
  //     if (err) {
  //         return({message: 'Error en la consulta'})
  //     }else{
  //         let carr = JSON.parse(data)
  //         let ind = carr[carr.length - 1]['id'] + 1
  //         let obj = {
  //             id: ind,
  //             timestamp: Date.now(),
  //             productos: []
  //         }
  //         carr.push(obj)
  //         fs.writeFile('./carrito.json', JSON.stringify(carr), 'utf-8', (err) => {
  //             if(err){
  //                 return 'Error al escribir'
  //             } else {
  //               res.send({message: `Carrito creado, id: ${obj.id}`})
  //             }
  //         } )
  //     }
  // })
});

carritoRouter.delete("/:id", async (req, res) => {
  // fs.readFile(`./carrito.json`, 'utf-8', (err, data) => {
  //     if (err) {
  //         return({message: 'Error en la lectura'})
  //     }else{
  //         let id = Number.parseInt(req.params.id)
  //         let carr = JSON.parse(data)
  //         let index = carr.findIndex(element => element['id'] === id)
  //         if(index == -1) {
  //             res.send({ error : 'carrito no encontrado' })
  //         } else {
  //             carr.splice(index, 1)
  //             fs.writeFile('./carrito.json', JSON.stringify(carr), 'utf-8', (err) => {
  //                 if(err){
  //                     return 'Error al escribir'
  //                 } else {
  //                     res.send({delete: 'ok', id: id})
  //                 }
  //             } )
  //             }}
  // })
});

carritoRouter.delete("/:id/productos/:id_prod", async (req, res) => {
  // fs.readFile(`./carrito.json`, 'utf-8', (err, data) => {
  //     if (err) {
  //         return({message: 'Error en la lectura'})
  //     }else{
  //         let id = Number.parseInt(req.params.id)
  //         let carr = JSON.parse(data)
  //         let index = carr.findIndex(element => element['id'] === id)
  //         if(index == -1) {
  //             res.send({ error : 'carrito no encontrado' })
  //         } else {
  //             let idP = Number.parseInt(req.params.id_prod)
  //             let indexProd = carr[index]['productos'].findIndex(element => element['id'] === idP)
  //             if(indexProd == -1) {
  //                 res.send({ error : 'producto no encontrado' })
  //             } else {
  //                 carr[index]['productos'].splice(indexProd, 1)
  //                 fs.writeFile('./carrito.json', JSON.stringify(carr), 'utf-8', (err) => {
  //                     if(err){
  //                         return 'Error al escribir'
  //                     } else {
  //                         res.send({message: `Producto con ID ${idP} eliminado.` })
  //                     }
  //                 } )
  //                 }
  //             }}
  // })
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
