import { Router } from "express";
import { addProductHandler, deleteProductHandler, getProductByIdHandler, productsFilterHandler, productsViewHandlerAdmin, productsViewHandlerUser, updateProductHandler } from "../controllers/product.controller.js";
import { authAdminOrPrem } from "../middlewares/authSessions/authSessions.js";
import { authUser } from "../middlewares/authSessions/authSessions.js";

const productRouter = Router() //Guardo todas las rutas en productRouter

/*
//Autenticación para poder acceder a la vista de productos
const authAdminOrPrem = (req, res, next) => {
    if (!req.session.user)
        //return res.send("Error de autenticación")
        return res.redirect('/sessions/login');
    const { rol } = req.session.user
    if (rol === "Administrador" || "Premium") return next()
}


//Autenticación para poder acceder a la vista de productos
const authUser = (req, res, next) => {
    if (!req.session.user)
        // return res.send("Error de autenticación")
        return res.redirect('/sessions/login');
    const { rol } = req.session.user
    if (rol === "Usuario") return next()
}*/

//Consulta de productos con filtros
productRouter.get("/", productsFilterHandler)

//Envío el array de productos inicial al cliente a través de socket
productRouter.get("/realtimeproductsAdmin", authAdminOrPrem, productsViewHandlerAdmin)

//Envío el array de productos inicial al cliente a través de socket
productRouter.get("/realtimeproductsUser", authUser, productsViewHandlerUser)

//Consulta de productos por id
productRouter.get("/:id", getProductByIdHandler)

//Agrego productos con método POST
productRouter.post("/", addProductHandler)

//Actualizo producto según ID con método PUT
productRouter.put("/:id", updateProductHandler)

//Elimino producto según ID con método DELETE
productRouter.delete("/:id", deleteProductHandler)

export default productRouter