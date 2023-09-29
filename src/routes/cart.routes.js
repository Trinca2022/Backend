import { Router } from "express";
import { addProductInCartHandler, createCartHandler, deleteProductInCartHandler, deleteProductsInCartHandler, endPurchaseHandler, getCartByIdHandler, getTicketHandler, updateCartHandler, updateProductInCartHandler } from "../controllers/cart.controller.js";

const cartRouter = Router()

//Creo carrito mediante método POST
cartRouter.post("/", createCartHandler)

//Consulta de carrito
cartRouter.get("/:id", getCartByIdHandler)

cartRouter.get("/:id/purchase", getTicketHandler)

//Agrego producto al carrito
cartRouter.post("/:id/product/:id_prod", addProductInCartHandler)

//Elimino producto según ID_PROD con método DELETE
cartRouter.delete("/:id/product/:id_prod", deleteProductInCartHandler)

//Actualizo cantidad producto según ID_PROD con método PUT
cartRouter.put("/:id/product/:id_prod", updateProductInCartHandler)

//Elimino TODOS los productos del carrito según su ID con método DELETE
cartRouter.delete("/:id", deleteProductsInCartHandler)

//Actualizo carrito entero con método PUT
cartRouter.put("/:id", updateCartHandler)

/*cartRouter.post("/:id/purchase", createOrderHandler)*/

cartRouter.post("/:id", endPurchaseHandler)

export default cartRouter