import { Router } from "express";
import { CartManager } from "../persistencia/cartManager.js";

const cartManager = new CartManager()

const cartRouter = Router()

//Creo carrito mediante método POST
cartRouter.post("/", async (req, res) => {
    const products = req.body
    await cartManager.createCarrito(products)
    res.send("Carrito creado")
})


//Consulta de carrito
cartRouter.get("/:id", async (req, res, next) => {
    try {
        const cart = await cartManager.getCartById(req.params.id)
        res.send(cart)
    }
    catch (error) {
        next(error)
    }
})

//Agrego producto al carrito
cartRouter.post("/:id/product/:id_prod", async (req, res) => {
    const id = req.params.id;
    const id_prod = req.params.id_prod;
    const message = await cartManager.addProductCart(id, id_prod)
    res.send(message)
})


//Elimino producto según ID_PROD con método DELETE
cartRouter.delete("/:id/product/:id_prod", async (req, res) => {
    const id = req.params.id;
    const id_prod = req.params.id_prod;
    const message = await cartManager.deleteProductCart(id, id_prod)
    res.send(message)
})


//Actualizo cantidad producto según ID_PROD con método PUT
cartRouter.put("/:id/product/:id_prod", async (req, res) => {
    const quant = req.body
    const id = req.params.id;
    const id_prod = req.params.id_prod;
    const message = await cartManager.putProductCart(id, id_prod, quant)
    res.send(message)
})

//Elimino todos los productos del carrito según su ID con método DELETE
cartRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const message = await cartManager.deleteProductsCart(id)
    res.send(message)
})

//Actualizo carrito entero con método PUT
cartRouter.put("/:id", async (req, res) => {
    const newProducts = req.body
    const id = req.params.id;
    const message = await cartManager.putCart(id, newProducts)
    res.send(message)
})




export default cartRouter