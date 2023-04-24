import { Router } from "express";
import { CartManager } from "../cartManager.js";

const cartManager = new CartManager('./cart.txt')

const cartRouter = Router()

//Creo carrito mediante método POST
cartRouter.post("/", async (req, res) => {
    const { cid, products } = req.body
    await cartManager.createCarrito({ cid, products })
    res.send("Producto creado")
})

//Consulta de productos
cartRouter.get("/:cid", async (req, res, next) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid)
        res.send(cart)
    }
    catch (error) {
        next(error)
    }
})

cartRouter.post("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const prodN = await cartManager.addProductCart(cid, pid)
    res.send(prodN)
})


export default cartRouter