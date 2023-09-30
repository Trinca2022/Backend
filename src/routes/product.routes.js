import { Router } from "express";
import { addProductHandler, deleteProductHandler, getProductByIdHandler, getProductsHandler, goToPremiumHandler, productsFilterHandler, productsViewHandlerAdmin, productsViewHandlerUser, updateProductHandler } from "../controllers/product.controller.js";
import { authAdminOrPrem } from "../middlewares/authSessions/authSessions.js";
import { authUser } from "../middlewares/authSessions/authSessions.js";

const productRouter = Router() //Guardo todas las rutas en productRouter

//Consulta de productos con filtros
//productRouter.get("/", productsFilterHandler)

//Consulta de productos con filtros
productRouter.get("/", getProductsHandler)

//Envío el array de productos inicial al cliente a través de socket
productRouter.get("/realtimeproductsAdmin", authAdminOrPrem, productsViewHandlerAdmin)

//Envío el array de productos inicial al cliente a través de socket
productRouter.get("/realtimeproductsUser", authUser, productsViewHandlerUser)

productRouter.post("/realtimeproductsUser", goToPremiumHandler)

//Consulta de productos por id
productRouter.get("/:id", getProductByIdHandler)

//Agrego productos con método POST
productRouter.post("/", addProductHandler)

//Actualizo producto según ID con método PUT
productRouter.put("/:id", updateProductHandler)

//Elimino producto según ID con método DELETE
productRouter.delete("/:id", deleteProductHandler)

export default productRouter