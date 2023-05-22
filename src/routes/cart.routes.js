import { Router } from "express";
import { CartManager } from "../cartManager.js";

const cartManager = new CartManager()

const cartRouter = Router()

//Creo carrito mediante método POST
cartRouter.post("/", async (req, res) => {
    const [products] = req.body
    await cartManager.createCarrito([products])
    res.send("Producto creado")
})


//Consulta de productos
cartRouter.get("/:id", async (req, res, next) => {
    try {
        const cart = await cartManager.getCartById(req.params.id)
        res.send(cart)
    }
    catch (error) {
        next(error)
    }
})

cartRouter.post("/:id/product/:id_prod", async (req, res) => {
    const id = req.params.id;
    const id_prod = req.params.id_prod;
    const message = await cartManager.addProductCart(id, id_prod)
    res.send(message)
})


export default cartRouter