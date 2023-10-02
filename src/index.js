import config from './config/config.js'
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
import usersRouter from './routes/users.routes.js'
import './utils/passportStrategies.js'
import { __dirname, __filename } from './path.js'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { ProductManager } from './services/productManager.js'
import { ChatManager } from './services/chatManager.js'
import './config/dbConfig.js'//Config mongoose
import { CartManager } from './services/cartManager.js'
import ticketRouter from './routes/ticket.routes.js'
import { productMongo } from './persistencia/DAOs/productMongo.js'
import { userModel } from './persistencia/models/Users.js'
import getProductFaker from './faker/routes.productFaker.js'
import errorHandler from './middlewares/errors/indexError.js'
import { addLogger } from './utils/logger.js'
import loggerRouter from './routes/logger.routes.js'
import swaggerJSDoc from 'swagger-jsdoc'//Config swagger
import swaggerUiExpress from 'swagger-ui-express'
import { transporter } from './utils/nodemailer.js'


//Utilizo los manager
const productManager = new ProductManager()
const chatManager = new ChatManager()
const cartManager = new CartManager()


//Creo y guardo productos/mensajes en mongodb
await productManager.createProducts()
await chatManager.createChats()

//Configuro express
const app = express()

//Configuro multer
const documentsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/archivos/documents')
    },
    filename: (req, file, cb) => {
        let fieldName = file.fieldname;
        let newFileName = '';
        if (fieldName === 'identificacion') {
            newFileName = 'identificacion.pdf';
        } else if (fieldName === 'domicilio') {
            newFileName = 'domicilio.pdf';
        } else if (fieldName === 'estadoCuenta') {
            newFileName = 'estadoCuenta.pdf';
        }
        cb(null, `${newFileName}`);
    }
});
const profilesStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/archivos/profiles')
    },
    filename: (req, file, cb) => {
        cb(null, "profilePic.jpg")
    }
})
const productsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/archivos/products')
    },
    filename: (req, file, cb) => {
        cb(null, "productPic.jpg")
    }
})

//Configuro middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
export const uploadDocuments = (multer({ storage: documentsStorage }))
export const uploadProfilePic = (multer({ storage: profilesStorage }))
export const uploadProductPic = (multer({ storage: productsStorage }))



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
            version: '1.0.0'
        }
    },
    apis: [`${process.cwd()}/src/docs/**/*.yaml`],
}
const spec = swaggerJSDoc(swaggerOptions)


//Configuro handlebars
app.engine('handlebars', engine())//Para trabajar con handlebars
app.set('view engine', 'handlebars')//Vistas de handlebars
app.set('views', path.resolve(__dirname, './views'))//Ubicación de las vistas




//Configuro logger
app.use(addLogger)

//Server de socket.io
const io = new Server(server)

//Configuro Sessions
app.use(session({
    store: MongoStore.create({
        mongoUrl: config.URL_MONGODB_ATLAS,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 3600
    }),
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

//Config swagger
app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec))


///////// -------------------- LÓGICA DE SOCKET ---------------------------//////////
//Conecto con cliente
io.on('connection', async (socket) => {
    console.log('Cliente conectado con socket')
    //Leo los productos/mensajes de mongodb
    const products = await productManager.getProducts()
    const chats = await chatManager.getMessages()

    //Emito el array con todos los productos/mensajes/sesiones
    socket.emit("allProducts", products)
    socket.emit("allChats", chats)

    //Recibo los campos cargados en form y los guardo en array products
    socket.on("newProduct", async (prod, userEmail) => {
        //Desestructuración de las propiedades del objeto prod
        const { title, description, price, thumbnail, code, stock } = prod
        const usuario = await userModel.findOne({ email: userEmail }).lean().exec();
        //Ejecuto el método addProduct de productManager y agrega el producto a los productos
        //Cargo prods en mongoose
        await productManager.addProduct({ title, description, price, thumbnail, code, stock, status: true, owner: usuario.email })
        const products = await productMongo.findAll()
        console.log("PRODUCTO CREADO")
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


    //AGREGAR PRODUCTO AL CARRITO
    socket.on("addProductCart", async (prod, userEmail) => {
        const { _id } = prod
        const usuario = await userModel.findOne({ email: userEmail }).lean().exec();
        const id = usuario.id_cart.toString()
        //Busco el rol del usuario actual
        const userSessionRol = usuario.rol
        //Busco el email del owner en la info del producto
        const product = await productManager.getProductById(_id)
        const prodOwnerEmailOrAdmin = product.owner
        //SI EL MAIL DE LA SESIÓN ES DISTINTO AL DEL OWNER SE PUEDE COMPRAR, siempre y cuando el rol sea distinto a Amin o si es USUARIO
        if (userEmail !== prodOwnerEmailOrAdmin && userSessionRol !== "Administrador" || userSessionRol === "Usuario") {
            const message = await cartManager.addProductInCart(id, _id)
            io.emit("prodInCart", message, _id)
        }
        else {
            socket.emit("productNotBuyed", "No tienes permisos para comprar este producto.");
        }
    })

    //Elimino un producto
    socket.on("deletedProduct", async (prod, userEmail) => {
        const { _id } = prod
        //Busco el rol del usuario actual
        const usuario = await userModel.findOne({ email: userEmail }).lean().exec();
        const userSessionRol = usuario.rol
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
            console.log("PRODUCTO BORRADO")
            const products = await productMongo.findAll()
            const filteredProducts = products.filter((product) => product._id.toString() !== _id);
            io.emit("allProducts", filteredProducts)
            //ENVÍO DE MAIL AL PREMIUM CUANDO ADMIN O PREMIUM ELIMINA UN PRODUCTO DE PREMIUM
            if (prodOwnerRol === "Premium") {
                await transporter.sendMail({
                    to: prodOwnerEmailOrAdmin,
                    subject: 'Producto eliminado',
                    text: `Se ha eliminado tu producto con ID ${_id}`
                })
            }
        }
        else {
            socket.emit("productNotDeleted", "No tienes permisos para eliminar este producto.");
        }
    })


})

///////////// -------------- TERMINA LÓGICA DE SOCKET ---------------------------///////////////

//Implemento Passport
app.use(passport.initialize());
app.use(passport.session())

//Configuro rutas
app.use('/product', productRouter)
app.use('/products', productRouter)
app.use('/cart', cartRouter)
app.use('/cart', express.static(__dirname + '/public/cart'))
app.use('/chat', chatRouter)
app.use('/product', express.static(__dirname + '/public'))
app.use('/product', express.static(__dirname + '/public/user'))
app.use('/chat', express.static(__dirname + '/public/chat'))
app.use('/sessions', sessionRouter)
app.use('/register', userRouter)
app.use('/ticket', ticketRouter)
app.use('/users', usersRouter)
app.use('/users', express.static(__dirname + '/public'))
//RUTA DE FAKER
app.use('/mockingproducts', getProductFaker)
//ERRORES
app.use(errorHandler)
app.use('/loggerTest', loggerRouter)
//Envía al login desde pag principal
app.use((req, res, next) => {
    if (req.method === 'GET' && req.url === '/') {
        // Redirige la solicitud GET de la ruta raíz a la ruta de inicio de sesión
        res.redirect('/sessions/login');
    } else {
        // Continúa con el flujo normal de la aplicación para otras rutas
        next();
    }
});
