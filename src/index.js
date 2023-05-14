import * as path from 'path'
import express from 'express'
import multer from 'multer'
import productRouter from './routes/product.routes.js'
import cartRouter from './routes/cart.routes.js'
import { __dirname, __filename } from './path.js'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { ProductManager } from './productManager.js'

//Config mongoose
import mongoose from 'mongoose'
import { userModel } from './models/user.js'

mongoose.connect("mongodb+srv://catrincavelli:Trinca09@cluster0.9vm5irb.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log("DB is connected"))
    .catch((error) => console.log("Errror en MongoDB Atlas :", error))


//app.listen(4000, () => console.log("Server on port 4000"))


const productManager = new ProductManager('./product.txt')

//Configuro express
const app = express()
const PORT = 4000
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img')
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`)
    }
})

//Configuro socket.io --> socket.io necesita saber en qué servidor está conectando
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

//Configuro handlebars
app.engine('handlebars', engine())//Para trabajar con handlebars
app.set('view engine', 'handlebars')//Vistas de handlebars
app.set('views', path.resolve(__dirname, './views'))//Ubicación de las vistas

//Configuro middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const upload = (multer({ storage: storage }))

//Server de socket.io
const io = new Server(server)

//Conecto con cliente
io.on('connection', async (socket) => {
    console.log('Cliente conectado')
    //Leo los productos del TXT
    const products = await productManager.getProducts()
    //Emito el array con todos los productos
    socket.emit("allProducts", products)
    //Recibo los campos cargados form y los guardo en array products
    socket.on("newProduct", async (prod) => {
        console.log(prod)
        //Desestructuración de las propiedades del objeto prod
        const { title, description, price, thumbnail, code, stock } = prod
        //Ejecuto el método addProduct de productoManager y agrega el producto a los productos
        //Escribe el archivo TXT con un nuevo producto
        await productManager.addProduct({ title, description, price, thumbnail, code, stock, status: true })
        const products = await productManager.getProducts()
        io.emit("allProducts", products)
    })
})

//Configuro rutas
app.use('/product', productRouter)
app.use('/cart', cartRouter)
app.use('/product', express.static(__dirname + '/public'))
app.post('/upload', upload.single('product'), (req, res) => {
    res.send("Imagen subida")
})

//Uso HBS para mostrar en home todos los productos
app.get('/', async (req, res) => {
    const products = await productManager.getProducts()
    res.render('home', {
        products: products
    })

})






