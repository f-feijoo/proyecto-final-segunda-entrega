import mongoose from "mongoose"
import config from "../config.js"
import { asPOJO, renameField, removeField } from "../utils/objectUtils.js";

mongoose.connect(config.mongodb.cnxStr, config.mongodb.options);

mongoose.connection.on('open', () => {
  console.log('Database ok!')
})

mongoose.connection.on('error', () => {
  console.log('Database error')
})

class ContenedorMongoDb {
  constructor(nombreColeccion, esquema) {
    this.coleccion = mongoose.model(nombreColeccion, esquema);
  }
  async mostrar(id) {
    try {
      const documento = await this.coleccion.find({ _id: id });
      if (documento.length == 0) {
        throw new Error("Error al listar por id: no encontrado");
      } else {
        const result = renameField(asPOJO(documento[0]), "_id", "id");
        return result;
      }
    } catch (error) {
      throw new Error(`Error al listar por id: ${error}`);
    }
  }

  async mostrarTodos() {
    try {
      let documentos = await this.coleccion.find();
      documentos = documentos.map(asPOJO);
      documentos = documentos.map((d) => renameField(d, "_id", "id"));
      return documentos;
    } catch (error) {
      throw new Error(`Error al listar todo: ${error}`);
    }
  }

  async guardar(obj) {
    try {
      let doc = await this.coleccion.create(obj);
      doc = asPOJO(doc);
      renameField(doc, "_id", "id");
      return doc;
    } catch (error) {
      throw new Error(`Error al guardar: ${error}`);
    }
  }

  async actualizar(elem) {
    try {
      renameField(elem, "id", "_id");
      const { n, nModified } = await this.coleccion.replaceOne(
        { _id: elem._id },
        elem
      );
      if (n == 0 || nModified == 0) {
        throw new Error("Error al actualizar: no encontrado");
      } else {
        renameField(elem, "_id", "id");
        return asPOJO(elem);
      }
    } catch (error) {
      throw new Error(`Error al actualizar: ${error}`);
    }
  }

  async borrar(id) {
    try {
      const { n, nDeleted } = await this.coleccion.deleteOne({ _id: id });
      if (n == 0 || nDeleted == 0) {
        throw new Error("Error al borrar: no encontrado");
      }
    } catch (error) {
      throw new Error(`Error al borrar: ${error}`);
    }
  }

  async borrarTodo() {
    await this.coleccion.deleteMany({});
  }
  catch(error) {
    throw new Error(`Error al borrar: ${error}`);
  }
}

export default ContenedorMongoDb