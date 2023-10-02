import { CartManager } from "../services/cartManager.js";
import { TicketManager } from "../services/ticketManager.js";
import { ProductManager } from "../services/productManager.js";

//Utilizo las funciones creadas en los managers (services), para ejecutar req, res y enviarlo a la ruta
const cartManager = new CartManager()
const ticketManager = new TicketManager()
const productManager = new ProductManager()

//Creo carrito mediante método POST
export const createCartHandler = async (req, res) => {
    const products = req.body
    let result = await cartManager.createOneCart(products)
    res.send({ status: "success", payload: result });
}

//Consulta de carrito
export const getCartByIdHandler = async (req, res, next) => {
    try {

        const cartID = req.params.id
        const cart = await cartManager.getCartById(cartID)

        const isPremium = req.session.user.rol === "Premium"
        const isUsuario = req.session.user.rol === "Usuario"
        const productsInCart = JSON.parse(JSON.stringify(cart.products))
        //const productsInCart = cart.products;

        let totalPrice = 0
        for (const product of productsInCart) {

            product.price = product.quantity * product.id_prod?.price ?? 0;
            totalPrice += product.price
        }

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

        const productsInCart = JSON.parse(JSON.stringify(cart.products))

        let totalPrice = 0
        for (const product of productsInCart) {
            product.price = product.quantity * product.id_prod?.price ?? 0;
            totalPrice += product.price;

            // Calcula el nuevo stock
            const newStock = product.id_prod.stock - product.quantity;

            // Asegúrate de que el stock nunca sea menor que cero
            const updatedStock = Math.max(newStock, 0);

            // Actualiza el producto en la base de datos con el nuevo stock
            await productManager.updateProduct(product.id_prod._id, { stock: updatedStock });
        }

        if (totalPrice !== 0) {
            const ticket = await ticketManager.createTicket(totalPrice, uEmail)
            const newTicket = JSON.parse(JSON.stringify(ticket))
            await cartManager.deleteProductsInCart(cartID)
            res.render('purchase', { layout: 'mainrealtimeCart', cartID, newTicket })
        }
        else res.send("Carrito vacío!")

    }
    catch (error) {
        console.log("error en get cart purchase", error)
        next(error)
    }
}


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
