import { CartManager } from "../services/cartManager.js";
//import { cartModel } from "../persistencia/models/Cart.js";
import { TicketManager } from "../services/ticketManager.js";

//Utilizo las funciones creadas en los managers (services), para ejecutar req, res y enviarlo a la ruta
const cartManager = new CartManager()
const ticketManager = new TicketManager()

/*//Creo carrito mediante método POST
export const createCartHandler = async (req, res) => {
    const products = req.body
    await cartManager.createCart(products)
    res.send("Carrito creado")
}*/

//Creo carrito mediante método POST
export const createCartHandler = async (req, res) => {
    const products = req.body
    let result = await cartManager.createOneCart(products)
    res.send({ status: "success", payload: result });
}

//Consulta de carrito
export const getCartByIdHandler = async (req, res, next) => {
    try {
        //const cartID = req.session.user.id_cart
        const cartID = req.params.id
        const cart = await cartManager.getCartById(cartID)
        //const cart = await cartManager.findOneById(cartID)
        //const cart = await cartModel.findById(cartID)
        //console.log("carrrrttt")
        const isPremium = req.session.user.rol === "Premium"
        console.log("isPremium???", isPremium)
        const isUsuario = req.session.user.rol === "Usuario"
        const productsInCart = JSON.parse(JSON.stringify(cart.products))
        //const productsInCart = cart.products;

        let totalPrice = 0
        for (const product of productsInCart) {
            // console.log("prod adentro for", product)
            product.price = product.quantity * product.id_prod?.price ?? 0;
            totalPrice += product.price
        }

        // const totalPriceProd = await cartManager.totalPriceProd(cartID,)
        //console.log("prooodd1114")
        res.render('realtimecart', {
            cart: JSON.stringify(cart),
            layout: 'mainrealtimeCart', productsInCart, isPremium, isUsuario, totalPrice, cartID


        })

    }
    catch (error) {
        console.log("error en get cart handler", error)
        next(error)
    }
}

export const getTicketHandler = async (req, res, next) => {
    try {
        const cartID = req.session.user.id_cart
        const uEmail = req.session.user.email
        const cart = await cartManager.getCartById(cartID)
        //console.log("cart", cart)
        const productsInCart = JSON.parse(JSON.stringify(cart.products))
        let totalPrice = 0
        for (const product of productsInCart) {
            // console.log("prod adentro for", product)
            product.price = product.quantity * product.id_prod?.price ?? 0;
            totalPrice += product.price
        }
        // HACER UNA FN PARA QUE NO SE GENERE UN TICKET CADA VEZ QUE CLICK BUTTON
        // si el producto tiene suficiente stock restarlo del stock y seguir
        //si el prod no tiene suficiente stock no sumarlo
        //devolver array con ids que no se compraron
        const ticket = await ticketManager.createTicket(totalPrice, uEmail)
        const newTicket = JSON.parse(JSON.stringify(ticket))





        res.render('purchase', { layout: 'mainrealtimeCart', cartID, newTicket })
    }
    catch (error) {
        console.log("error en get cart purchase", error)
        next(error)
    }
}


/**/
/*
export const getCartByIdHandler = async (req, res, next) => {
    try {
        const cart = await cartManager.getCartById(req.params.id)
        //res.send(cart)
        res.render('realtimecart', { cart: JSON.stringify(cart), layout: 'mainrealtimeCart' })
        //res.send("HOLAAAA MALDITO CART")

    }
    catch (error) {
        next(error)
    }
}*/


//Agrego producto al carrito
export const addProductInCartHandler = async (req, res) => {
    const id = req.params.id;
    const id_prod = req.params.id_prod;
    const message = await cartManager.addProductInCart(id, id_prod)
    res.send(message)
}

//Elimino producto según ID_PROD con método DELETE
export const deleteProductInCartHandler = async (req, res) => {
    try {
        const id = req.params.id;
        const id_prod = req.params.id_prod;
        const message = await cartManager.deleteProductInCart(id, id_prod)
        res.send(message)
    }
    catch (error) {
        next(error)
    }
}

//Actualizo cantidad producto según ID_PROD con método PUT
export const updateProductInCartHandler = async (req, res) => {
    const quant = req.body
    const id = req.params.id;
    const id_prod = req.params.id_prod;
    const message = await cartManager.updateProductInCart(id, id_prod, quant)
    res.send(message)
}

//Elimino TODOS los productos del carrito según su ID con método DELETE
export const deleteProductsInCartHandler = async (req, res) => {
    const id = req.params.id;
    const message = await cartManager.deleteProductsInCart(id)
    res.send(message)
}

//Actualizo carrito entero con método PUT
export const updateCartHandler =
    async (req, res) => {
        const newProducts = req.body
        const id = req.params.id;
        const message = await cartManager.updateCart(id, newProducts)
        res.send(message)
    }

/*//Creo orden
export const createOrderHandler = async (req, res) => {
    const id_cart = req.params.id_cart;
    await cartManager.createCart(products)
    res.send("Carrito creado")
}*/

export const endPurchaseHandler = async (req, res, next) => {
    try { }
    catch { }
}