import { CartManager } from "../services/cartManager.js";

//Utilizo las funciones creadas en los managers (services), para ejecutar req, res y enviarlo a la ruta
const cartManager = new CartManager()

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
        const cart = await cartManager.getCartById(req.params.id)
        const isPremium = req.session.user.rol === "Premium"
        const isUsuario = req.session.user.rol === "Usuario"
        //res.send(cart)
        res.render('realtimecart', { isPremium, isUsuario, cart: JSON.stringify(cart), layout: 'mainrealtimeCart' })

    }
    catch (error) {
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
    const id = req.params.id;
    const id_prod = req.params.id_prod;
    const message = await cartManager.deleteProductInCart(id, id_prod)
    res.send(message)
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