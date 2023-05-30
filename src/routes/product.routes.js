import { Router } from "express";
import { ProductManager } from "../productManager.js";
import { productModel } from "../models/Products.js";

const productManager = new ProductManager()

const productRouter = Router() //Guardo todas las rutas en productRouter


//Consulta de productos
productRouter.get("/", async (req, res, next) => {

    try {

        let { limit, page, price, order } = req.query
        // const products = await productManager.getProducts()
        //const products = await productModel.paginate({ price: price }, { limit: limit, page: page, sort: sort })

        limit = limit ?? 10
        page = page ?? 1
        //price = price ?? ">0"
        order = order ?? 0
        if (!price) { const filter = undefined }
        else { const filter = `price: ${price}` }

        /* if (limit ?? page ?? price ?? sort) {
             const products = await productModel.paginate({ price: price }, { limit: limit, page: page, sort: sort })
             res.send(JSON.stringify(products))
 
         } else {*/

        const products = await productModel.paginate({}, { limit: limit, page: page, sort: { price: order } })

        res.send(JSON.stringify(products))

    }
    catch (error) {
        next(error)
    }
})

//Envío el array de productos inicial al cliente a través de socket
productRouter.get("/realtimeproducts", async (req, res, next) => {
    try {
        const products = await productManager.getProducts()
        //Envío array al cliente para renderizar
        res.render('realtimeproducts', { products: products, layout: 'mainrealtime' })
    }
    catch (error) {
        next(error)
    }
})

//Consulta de productos por id
productRouter.get("/:id", async (req, res) => {
    const product = await productManager.getProductById(req.params.id)
    //res.send(product)
    res.render('product', {
        title: product.title,
        description: product.description,
        price: product.price,
        code: product.code,
        stock: product.stock

    })
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