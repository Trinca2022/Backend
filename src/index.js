import 'dotenv/config.js'
import * as path from 'path'
import express from 'express'
import multer from 'multer'
import productRouter from './routes/product.routes.js'
import cartRouter from './routes/cart.routes.js'
import chatRouter from './routes/chat.routes.js'
import { __dirname, __filename } from './path.js'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { ProductManager } from './productManager.js'
import { ChatManager } from './chatManager.js'
//Config mongoose
import mongoose from 'mongoose'
import { userModel } from './models/user.js'
import { productModel } from './models/Products.js'
import { cartModel } from './models/Cart.js'
import { messageModel } from './models/Messages.js'
import { CartManager } from './cartManager.js'


//Conexión con mongoose
mongoose.connect(process.env.URL_MONGODB_ATLAS)
    .then(() => console.log("DB is connected"))
    .catch((error) => console.log("Errror en MongoDB Atlas :", error))

const productManager = new ProductManager()
const chatManager = new ChatManager()
const cartManager = new CartManager()

//Creo y guardo productos/mensajes/carrito en mongodb
await productManager.createProducts()
await chatManager.createChats()
await cartManager.createCarrito()

//Configuro express
const app = express()
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img')
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`)
    }
})

//Configuro socket.io --> socket.io necesita saber en qué servidor está conectando
const server = app.listen(process.env.PORT, () => {
    console.log("Server on port", process.env.PORT)
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
    //Leo los productos/mensajes de mongodb
    const products = await productManager.getProducts()
    const chats = await chatManager.getMessages()
    //Emito el array con todos los productos/mensajes
    socket.emit("allProducts", products)
    socket.emit("allChats", chats)
    //Recibo los campos cargados en form y los guardo en array products
    socket.on("newProduct", async (prod) => {
        console.log(prod)
        //Desestructuración de las propiedades del objeto prod
        const { title, description, price, thumbnail, code, stock } = prod
        //Ejecuto el método addProduct de productManager y agrega el producto a los productos
        //Cargo prods en mongoose
        await productManager.addProduct({ title, description, price, thumbnail, code, stock, status: true })
        const products = await productManager.getProducts()
        io.emit("allProducts", products)
    })
    //Recibo los campos cargados en form y los guardo en chats
    socket.on("newChat", async (chat) => {
        console.log(chat)
        //Ejecuto el método addChat de chatManager y agrega el mensaje al chat
        //Cargo mensajes en mongoose
        await chatManager.addChat(chat)
        const chats = await chatManager.getMessages()
        io.emit("allChats", chats)

    })
})

//Configuro rutas
app.use('/product', productRouter)
app.use('/cart', cartRouter)
app.use('/chat', chatRouter)
app.use('/product', express.static(__dirname + '/public'))
app.use('/chat', express.static(__dirname + '/public/chat'))
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






