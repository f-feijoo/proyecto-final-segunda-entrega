import fs from 'fs'
import config from "../config.js"

class ContenedorArchivo {
  constructor(path) {
    this.ruta = `${config.fileSystem.path}/${path}`;
  }

  async mostrar(id) {
    const objetos = await this.mostrarTodos();
    const obj = objetos.find((o) => o.id == id);
    return obj;
  }

  async mostrarTodos() {
    await fs.readFile(this.ruta, "utf-8", (err, data) => {
      if (err) {
        return { message: "Error en la lectura" };
      } else {
        return JSON.parse(data);
      }
    });
  }

  async guardar(obj) {
    const objetos = await this.mostrarTodos();
    let newId;
    if (objetos.length == 0) {
      newId = 1;
    } else {
      newId = objetos[objetos.length - 1].id + 1;
    }
    let newObjeto = { ...obj, id: newId };
    objetos.push(newObjeto);
    await fs.writeFile(this.ruta, JSON.stringify(objetos), (err) => {
      if (err) {
        return { message: "Error en la escritura" };
      } else {
        return newObjeto;
      }
    });
  }

  async actualizar(elem) {
    const objetos = await this.mostrarTodos();
    const index = objetos.findIndex((o) => o.id == elem.id);
    if (index == -1) {
      throw new Error(`Error al actualizar: no se encontró el id ${elem.id}`);
    } else {
      objetos[index] = elem;
      await fs.writeFile(this.ruta, JSON.stringify(objetos), (err) => {
        if (err) {
          throw new Error(`Error al actualizar: ${err}`);
        } else {
          return elem
        }
      });
    }
  }

  async borrar(id) {
    const objetos = await this.mostrarTodos();
    const index = objetos.findIndex((o) => o.id == id);
    if (index == -1) {
      throw new Error(`Error al borrar: no se encontró el id ${id}`);
    }

    objetos.splice(index, 1);
    await fs.writeFile(this.ruta, JSON.stringify(objetos), (err) => {
      if (err) {
        throw new Error(`Error al borrar: ${err}`);
      }
    });
  }

  async borrarTodo() {
    await fs.writeFile(this.ruta, JSON.stringify([]), (err) => {
      if (err) {
        throw new Error(`Error al borrar todo: ${err}`);
      }
    });
  }
}

export default ContenedorArchivo;
