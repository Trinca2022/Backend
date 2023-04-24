import { Router } from "express";
import { ProductManager } from "../productManager.js";

const productManager = new ProductManager('./product.txt')

const productRouter = Router() //Guardo todas las rutas en productRouter

//Consulta de productos
productRouter.get("/", async (req, res, next) => {
    try {
        const { limit } = req.query
        const products = await productManager.getProducts()
        if (limit) {
            res.send(JSON.stringify(products.slice(0, limit)))
        } else {
            res.send(JSON.stringify(products))
        }
    }
    catch (error) {
        next(error)
    }
})


//Consulta de productos por id
productRouter.get("/:id", async (req, res) => {
    const product = await productManager.getProductById(req.params.id)
    res.send(product)
})

//Agrego productos con método POST
productRouter.post("/", async (req, res) => {
    const { title, description, price, thumbnail, code, stock, status } = req.body
    const prodNew = await productManager.addProduct({ title, description, price, thumbnail, code, stock, status })
    res.send(prodNew)
})

//Actualizo producto según ID con método PUT
productRouter.put("/:id", async (req, res) => {
    const id = req.params.id
    const { title, description, price, thumbnail, code, stock, status } = req.body

    const mensaje = await productManager.updateProduct(id, { title, description, price, thumbnail, code, stock, status })

    res.send(mensaje)
})

//Elimino producto según ID con método DELETE
productRouter.delete("/:id", async (req, res) => {
    const id = req.params.id
    const mensaje = await productManager.deleteProduct(id)
    res.send(mensaje)
})

export default productRouter