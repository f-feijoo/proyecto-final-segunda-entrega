import 'dotenv/config'
let productosDao;
let carritosDao;

switch (process.env.PERS) {
  case "json":
    const { default: ProductosDaoArchivo } = await import(
      "./productos/ProductosDaoArchivos.js"
    );
    const { default: CarritosDaoArchivo } = await import(
      "./carritos/CarritosDaoArchivos.js"
    );

    productosDao = new ProductosDaoArchivo();
    carritosDao = new CarritosDaoArchivo();
    break;
  case "mongodb":
    const { default: ProductosDaoMongoDb } = await import(
      "./productos/ProductosDaoMongoDb.js"
    );
    const { default: CarritosDaoMongoDb } = await import(
      "./carritos/CarritosDaoMongoDb.js"
    );

    productosDao = new ProductosDaoMongoDb();
    carritosDao = new CarritosDaoMongoDb();
    break;
  default:
    const { default: ProductosDaoMem } = await import(
      "./productos/ProductosDaoMemoria.js"
    );
    const { default: CarritosDaoMem } = await import(
      "./carritos/CarritosDaoMemoria.js"
    );

    productosDao = new ProductosDaoMem();
    carritosDao = new CarritosDaoMem();
    break;
}

export { productosDao, carritosDao };
