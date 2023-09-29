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
import { UserManager } from './services/userManager.js'
//import { SessionManager } from './services/sessionManager.js'
import { transporter } from './utils/nodemailer.js'


//Utilizo los manager
const productManager = new ProductManager()
const chatManager = new ChatManager()
const cartManager = new CartManager()
//const userManager = new UserManager()
//const sessionManager = new SessionManager()


//Creo y guardo productos/mensajes en mongodb
await productManager.createProducts()
await chatManager.createChats()
//await cartManager.createCart()

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
        //ttl: 1000
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

    /*
        //Leo info del usuario logueado desde la colección sessions de mongodb
        const latestSession = await sessionModel.findOne().sort({ $natural: -1 }).exec();
        //REVISO QUE LA SESIÓN ESTÉ ACTIVA
        if (latestSession) {
            const data = JSON.parse(latestSession.session);
            const userDatos = data.user;
    */


    //Emito el array con todos los productos/mensajes/sesiones
    socket.emit("allProducts", products)
    socket.emit("allChats", chats)
    //socket.emit("adminName", userDatos)
    //socket.emit("userName", userDatos)
    //socket.emit("idCart", userDatos)

    /* socket.on('correoUsuario', async (userEmail) => {
         console.log('Correo del usuario recibido en el servidor:', userEmail);
         // BUSCAR INFO DE USER POR SU EMAIL
         const user = await userModel.findOne({ userEmail }).lean().exec();
           console.log("USER SOLUCIÓN", user);
 
           // Emitir los datos del usuario al cliente
           io.emit("renderEmail", user);
     });

    socket.on('correoUsuario', async (email) => {
        console.log('correoUsuario', email)
    })*/

    /*  socket.on('correoUsuario', async (email) => {
          try {
              // Aquí puedes realizar la búsqueda de información del usuario en la base de datos
              //const usuario = await userModel.findOne({ userEmail }).lean().exec();
 
              // Si encuentras el usuario, puedes enviar los datos al cliente
              if (usuario) {
                  socket.emit('usuarioEncontrado', usuario);
              } else {
                  // Si no se encuentra el usuario, puedes enviar un mensaje de error al cliente
                  socket.emit('usuarioNoEncontrado', 'Usuario no encontrado');
              }
          } catch (error) {
              // Manejo de errores
              console.error('Error al buscar el usuario:', error);
              socket.emit('error', 'Ocurrió un error al buscar el usuario');
          }
      });*/


    //Recibo los campos cargados en form y los guardo en array products
    socket.on("newProduct", async (prod, userEmail) => {
        //Desestructuración de las propiedades del objeto prod
        const { title, description, price, thumbnail, code, stock } = prod
        const usuario = await userModel.findOne({ email: userEmail }).lean().exec();
        //Ejecuto el método addProduct de productManager y agrega el producto a los productos
        //Cargo prods en mongoose
        await productManager.addProduct({ title, description, price, thumbnail, code, stock, status: true, owner: usuario.email })
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

    /*//-----------------BORRAR--------------//
    //Ir al carrito según rol
    socket.on("goToCart", async () => {
        //Busco el rol del usuario actual
        const userSessionRol = userDatos.rol;
        if (userSessionRol === "Administrador") {
            socket.emit("notGoToCart", "No tienes permisos para acceder a esta ruta");
        }
        if (userSessionRol === "Premium") {

            socket.emit("redirectToCart", "/cart/realtimecart");
        }
        if (userSessionRol === "Usuario") {

            socket.emit("redirectToCart", "/cart/realtimecart");
        }
    })
    //----------------------------------------//


    //-----------------BORRAR--------------//
    //Ir desde el carrito a productos según el rol
    socket.on("goToProds", async () => {
        //Busco el rol del usuario actual
        const userSessionRol = userDatos.rol;
        if (userSessionRol === "Usuario") {
            socket.emit("redirectToUserProds", "/product/realtimeproductsUser");
        }
        if (userSessionRol === "Premium") {
            socket.emit("redirectToPremiumProds", "/product/realtimeproductsAdmin");
        }
    })
    //----------------------------------------//
*/
    //-----------------BORRAR--------------//
    //Cambio de user a premium --> VERIFICACIÓN DE STATUS: TRUE
    /*
    socket.on("goToPremium", async () => {
        //Verifico que estén los docs cargados
        const statusUpdatedUser = await userManager.userToPremium()
        //console.log("STATUS INDEX", statusUpdatedUser)
        if (statusUpdatedUser === true) {
            //Actualizo el rol del usuario actual
            const idUser = userDatos._id
            const updateRol = await userManager.updateUser(idUser, { rol: "Premium" })
            //console.log("NUEVO ROL", updateRol)

            socket.emit("redirectToPremiumProds", "/product/realtimeproductsAdmin");
        }
        if (statusUpdatedUser === false) { socket.emit("notGoToPremium", "No tienes permisos: faltan subir archivos para cambiar a Premium") }

    })

    // ----------------------------------------//
*/
    /*
    //-----------------BORRAR--------------//
    //Cambio de premium a user
    socket.on("goToUsuario", async () => {
        //Busco el rol del usuario actual
        const userSessionRol = userDatos.rol;
        if (userSessionRol === "Administrador") {
            socket.emit("notGoToUser", "No tienes permisos para acceder a esta ruta")
        }
        else if (userSessionRol === "Premium" || userSessionRol === "Usuario") {
            const idUser = userDatos._id
            const updateRol = await userManager.updateUser(idUser, { rol: "Usuario" })
            socket.emit("redirectToUserProds", "/product/realtimeproductsUser")
        }
    })
    //----------------------------------------//
*/

    //AGREGAR PRODUCTO AL CARRITO
    socket.on("addProductCart", async (prod, userEmail) => {
        const { _id } = prod
        console.log("ID PROD A COMPRAR", _id)
        //const id = userDatos.id_cart
        const usuario = await userModel.findOne({ email: userEmail }).lean().exec();
        // console.log("usuario index", usuario)
        const id = usuario.id_cart.toString()
        console.log("id cart QUE compra ", id)
        //Busco el rol del usuario actual
        // const userSessionRol = userDatos.rol;
        const userSessionRol = usuario.rol
        //Busco el email del owner en la info del producto
        const product = await productManager.getProductById(_id)
        const prodOwnerEmailOrAdmin = product.owner
        //Busco el rol del usuario que creó el producto
        const users = await userModel.find()
        const prodOwner = users.find(user => user.email === prodOwnerEmailOrAdmin || user.rol === prodOwnerEmailOrAdmin)

        const prodOwnerRol = prodOwner.rol
        //Si el rol de la sesión es distinto al owner del prod: se puede comprar, siempre y cuando el rol sea distinto a Amin
        if (userSessionRol !== prodOwnerRol && userSessionRol !== "Administrador") {

            const message = await cartManager.addProductInCart(id, _id)
            console.log("messageee", message)
            // console.log("PROD COMPRADO CON EXITT")
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
        console.log("email QUE BORRA", userEmail)
        // console.log("USUARIO QUE BORRA", 
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
            console.log("ID PROD A ELIMINAR", _id)
            const products = await productMongo.findAll()
            const filteredProducts = products.filter((product) => product._id.toString() !== _id);
            io.emit("allProducts", filteredProducts)
            //ENVÍO DE MAIL AL PREMIUM CUANDO ADMIN O PREMIUM ELIMINA UN PRODUCTO DE PREMIUM
            if (prodOwnerRol === "Premium") {
                await transporter.sendMail({
                    to: prodOwnerEmailOrAdmin,
                    subject: 'Producto eliminado',
                    text: `Se ha eliminado tu producto con ID ${_id} de la base de datos`
                })
            }
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




    /*
        //Emito productos del carrito para renderizarlos 
        //Busco el rol del usuario actual
        // const userSessionRol = userDatos.rol;
        const usuario = await userModel.findOne({ userEmail }).lean().exec();
        //Busco el rol del usuario actual
        // const userSessionRol = userDatos.rol;
        const userSessionRol = usuario.rol
        if (userSessionRol === "Usuario" || userSessionRol === "Premium") {
            const idCart = userDatos.id_cart
            const cart = await cartManager.findOneById(idCart)
            const idProdsInCart = cart.products.map(prod => prod.id_prod)
            const quantityProdsInCart = cart.products.map(prod => prod.quantity)
            const idsExtraidos = idProdsInCart.map((idObj) => idObj.toString());
            const prodsInCart = await productMongo.findByIds(idsExtraidos)
            const quantityByProductId = {};
            prodsInCart.forEach((prod, index) => {
                quantityByProductId[prod._id] = quantityProdsInCart[index];
            });
            socket.emit("getProdsInCart", prodsInCart, quantityByProductId)
        }
        else if (userSessionRol === "Administrador") { return }*/



})
//else return})



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
//RUTA DE FAKER
app.use('/mockingproducts', getProductFaker)
//ERRORES
app.use(errorHandler)
app.use('/loggerTest', loggerRouter)
//Uso HBS para mostrar en home el login
/*app.get('/', async (req, res) => {
    const products = await productModel.find()
    res.render('sessions/login',
        { style: 'styles.css' })
})*/