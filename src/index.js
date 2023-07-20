import 'dotenv/config.js'
import * as path from 'path'
import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import multer from 'multer'
import passport from 'passport'
import productRouter from './routes/product.routes.js'
import cartRouter from './routes/cart.routes.js'
import chatRouter from './routes/chat.routes.js'
import sessionRouter from './routes/session.routes.js'
import userRouter from './routes/user.routes.js'
import './passportStrategies.js'
import { __dirname, __filename } from './path.js'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { ProductManager } from './services/productManager.js'
import { ChatManager } from './services/chatManager.js'
//Config mongoose
import './config/dbConfig.js'
import { productModel } from './persistencia/models/Products.js'
import { CartManager } from './services/cartManager.js'
import { sessionModel } from './persistencia/models/Sessions.js'
import ticketRouter from './routes/ticket.routes.js'
import { productMongo } from './persistencia/DAOs/productMongo.js'
import { userModel } from './persistencia/models/Users.js'


/*//Conexión con mongoose --> pasado a config/dbConfig.js
mongoose.connect(process.env.URL_MONGODB_ATLAS)
    .then(() => console.log("DB is connected"))
    .catch((error) => console.log("Errror en MongoDB Atlas :", error))*/

const productManager = new ProductManager()
const chatManager = new ChatManager()
const cartManager = new CartManager()

//Creo y guardo productos/mensajes/carrito en mongodb
await productManager.createProducts()
await chatManager.createChats()
await cartManager.createCart()

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

//Configuro Sessions
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.URL_MONGODB_ATLAS,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        // ttl: 210
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

//Conecto con cliente
io.on('connection', async (socket) => {
    console.log('Cliente conectado')
    //Leo los productos/mensajes de mongodb
    const products = await productModel.find()
    const chats = await chatManager.getMessages()
    //Leo info del usuario logueado desde la colección sessions de mongodb
    const latestSession = await sessionModel.findOne().sort({ $natural: -1 }).exec();
    const data = JSON.parse(latestSession.session);
    const userDatos = data.user;


    //Emito el array con todos los productos/mensajes/sesiones
    socket.emit("allProducts", products)
    socket.emit("allChats", chats)
    socket.emit("adminName", userDatos)
    socket.emit("userName", userDatos)
    socket.emit("idCart", userDatos)

    //Recibo los campos cargados en form y los guardo en array products
    socket.on("newProduct", async (prod) => {
        console.log(prod)
        //Desestructuración de las propiedades del objeto prod
        const { title, description, price, thumbnail, code, stock } = prod
        //Ejecuto el método addProduct de productManager y agrega el producto a los productos
        //Cargo prods en mongoose
        await productManager.addProduct({ title, description, price, thumbnail, code, stock, status: true })
        //const products = await productModel.find()
        const products = await productMongo.findAll()
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

    //Elimino un producto
    socket.on("deletedProduct", async (prod) => {
        const { _id } = prod
        await productMongo.deleteOne(_id)
        console.log("HOLA id", _id)
        //console.log("HOLA SERGUNDO ID", id.toString())
        //const products = await productMongo.findOneById(_id)
        const products = await productMongo.findAll()
        //console.log("HOLA PROD", products)
        const filteredProducts = products.filter((product) => product._id.toString() !== _id);
        io.emit("allProducts", filteredProducts)

    })

    /*//ACTUALIZO PRODUCTO
    socket.on("updatedProduct", async (prod) => {
        const { _id, title, description, price, thumbnail, code, stock } = prod
        await productMongo.updateOne(_id, { title, description, price, thumbnail, code, stock, status: true })
        const products = await productModel.find()
        io.emit("allProducts", products)
    })*/

    //AGREGAR PRODUCTO AL CARRITO
    socket.on("addProduct", async (prod) => {
        const { _id } = prod
        const id = userDatos.id_cart
        await cartManager.addProductInCart(id, { _id })
        io.emit("prodInCart", _id)
        //const productsInCart = await cartManager.getCartById(_id)
        //io.emit("allProducts", productsInCart)
    })

})

//Implemento Passport
app.use(passport.initialize());
app.use(passport.session())

//Configuro rutas
app.use('/product', productRouter)
app.use('/cart', cartRouter)
app.use('/cart', express.static(__dirname + '/public/cart'))
app.use('/chat', chatRouter)
app.use('/product', express.static(__dirname + '/public'))
app.use('/product', express.static(__dirname + '/public/user'))
app.use('/chat', express.static(__dirname + '/public/chat'))
app.use('/sessions', sessionRouter)
app.use('/register', userRouter)
app.use('/ticket', ticketRouter)
app.post('/upload', upload.single('product'), (req, res) => {
    res.send("Imagen subida")
})


//Uso HBS para mostrar en home el login
app.get('/', async (req, res) => {
    const products = await productModel.find()
    res.render('sessions/login')
})