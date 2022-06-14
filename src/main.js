import app from './server.js'
import 'dotenv/config'

const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}, base de datos ${process.env.PERS}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))
