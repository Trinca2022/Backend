import config from './config.js'
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
import './utils/passportStrategies.js'
import { __dirname, __filename } from './path.js'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { ProductManager } from './services/productManager.js'
import { ChatManager } from './services/chatManager.js'
import './config/dbConfig.js'//Config mongoose
import { productModel } from './persistencia/models/Products.js'
import { CartManager } from './services/cartManager.js'
import { sessionModel } from './persistencia/models/Sessions.js'
import ticketRouter from './routes/ticket.routes.js'
import { productMongo } from './persistencia/DAOs/productMongo.js'
import { userModel } from './persistencia/models/Users.js'
import getProductFaker from './faker/routes.productFaker.js'
import errorHandler from './middlewares/errors/indexError.js'
import { addLogger } from './utils/logger.js'
import loggerRouter from './routes/logger.routes.js'
import swaggerJSDoc from 'swagger-jsdoc'//Config swagger
import swaggerUiExpress from 'swagger-ui-express'

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

/*import bodyParser from 'body-parser';
app.use(bodyParser.json());*/

//Configuro socket.io --> socket.io necesita saber en qué servidor está conectando
const server = app.listen(config.PORT, () => {
    console.log(`Escuchando al puerto ${config.PORT}`)
})

//Configuración de swagger para documentar la API
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: "Documentación de las APIs",
            description: "Información de productos y carritos",
            version: '1.0.0',
            /*contact:{
                name:"Andrea Lopez",
                url: "https://www.linkedin.com/in/adelid-andrea-l%C3%B3pez-411868105/"
            }*/
        }
    },
    apis: [`${process.cwd()}/src/docs/**/*.yaml`],
    //apis: [`./docs/**/*.yaml`]
    //apis: [`./docs/Users/Users.yaml`]
    //apis: [`./docs/Users/Users.yaml`]
    //apis: [(__dirname, './docs/Users/Users.yaml')]
}

const spec = swaggerJSDoc(swaggerOptions)


//Configuro handlebars
app.engine('handlebars', engine())//Para trabajar con handlebars
app.set('view engine', 'handlebars')//Vistas de handlebars
app.set('views', path.resolve(__dirname, './views'))//Ubicación de las vistas

//Configuro middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const upload = (multer({ storage: storage }))

//Configuro logger
app.use(addLogger)

//Server de socket.io
const io = new Server(server)

//Configuro Sessions
app.use(session({
    store: MongoStore.create({
        mongoUrl: config.URL_MONGODB_ATLAS,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        // ttl: 210
    }),
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

//Config swagger
app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec))

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

    /*socket.on("getCart", async (args, callback) => {
            const cart = await cartManager.getCartById(userDatos.id_cart)
            const idProdsinCart = cart.products.map(prod => prod.id_prod)
            const prodsInCart = await productMongo.findByIds(idProdsinCart)
            callback({ cart, prodsInCart })
            console.log(cart, prodsInCart)
        })*/


    /*socket.on("getCart", async (args, callback) => {
        const cart = await cartManager.getCartById(userDatos.id_cart)
        const idProdsinCart = cart.products.map(prod => prod.id_prod)
        const prodsInCart = await productMongo.findByIds(idProdsinCart)
        callback({ cart, prodsInCart })
        console.log(cart, prodsInCart)
    })*/

    //Recibo los campos cargados en form y los guardo en array products
    socket.on("newProduct", async (prod) => {
        console.log(prod)
        //Desestructuración de las propiedades del objeto prod
        const { title, description, price, thumbnail, code, stock } = prod
        //Ejecuto el método addProduct de productManager y agrega el producto a los productos
        //Cargo prods en mongoose
        await productManager.addProduct({ title, description, price, thumbnail, code, stock, status: true, owner: userDatos.email })
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
        //Busco el rol del usuario actual
        const userSessionRol = userDatos.rol;
        //Busco el email del owner en la info del producto
        const product = await productManager.getProductById(_id)
        const prodOwnerEmailOrAdmin = product.owner
        //Busco el rol del usuario que creó el producto
        const users = await userModel.find()
        const prodOwner = users.find(user => user.email === prodOwnerEmailOrAdmin || user.rol === prodOwnerEmailOrAdmin)
        const prodOwnerRol = prodOwner.rol
        //Si el rol de la sesión coincide con la del owner: borro prod
        //Si la sesión es de Admin: borro prod
        if (userSessionRol === prodOwnerRol || userSessionRol === "Administrador") {
            await productManager.deleteProduct(_id)
            console.log("ID PROD A ELIMINAR", _id)
            const products = await productMongo.findAll()
            const filteredProducts = products.filter((product) => product._id.toString() !== _id);
            io.emit("allProducts", filteredProducts)
        }
        else {
            socket.emit("productNotDeleted", "No tienes permisos para eliminar este producto.");
        }
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
        //Busco el rol del usuario actual
        const userSessionRol = userDatos.rol;
        //Busco el email del owner en la info del producto
        const product = await productManager.getProductById(_id)
        const prodOwnerEmailOrAdmin = product.owner
        //Busco el rol del usuario que creó el producto
        const users = await userModel.find()
        const prodOwner = users.find(user => user.email === prodOwnerEmailOrAdmin || user.rol === prodOwnerEmailOrAdmin)
        const prodOwnerRol = prodOwner.rol
        //Si el rol de la sesión es distinto al owner del prod: se puede comprar
        if (userSessionRol !== prodOwnerRol) {
            await cartManager.addProductInCart(id, { _id })
            io.emit("prodInCart", _id)
        }
        else {
            socket.emit("productNotBuyed", "No tienes permisos para comprar este producto.");
        }

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
//RUTA DE FAKER
app.use('/mockingproducts', getProductFaker)

//ERRORES
app.use(errorHandler)
app.use('/loggerTest', loggerRouter)

//IMG
app.post('/upload', upload.single('product'), (req, res) => {
    res.send("Imagen subida")
})


//Uso HBS para mostrar en home el login
app.get('/', async (req, res) => {
    const products = await productModel.find()
    res.render('sessions/login',
        { style: 'styles.css' })
})