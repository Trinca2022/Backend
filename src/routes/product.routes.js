import { Router } from "express";
import { ProductManager } from "../productManager.js";
import { productModel } from "../models/Products.js";

const productManager = new ProductManager()

const productRouter = Router() //Guardo todas las rutas en productRouter


//Consulta de productos con filtros
productRouter.get("/", async (req, res, next) => {
    try {
        let { limit, page, status, sort } = req.query
        let hasPrevPage = true
        let hasNextPage = true

        limit = limit ?? 10
        page = page ?? 1
        status = status ?? true
        sort = sort ?? 0

        const products = await productModel.paginate({ status: status }, { limit: limit, page: page, sort: { price: sort } })


        if (page <= 1)
            hasPrevPage = false
        /*if (page = totalPages)
            hasNextPage = false*/


        const response = {
            status: "success",
            docs: products,
            totalPages: 3,
            page: page,
            prevPage: Number(page) - 1,
            nextPage: Number(page) + 1,
            hasPrevPage: hasPrevPage,
            //hasNextPage: hasNextPage
        }

        res.send(response)
        res.send(JSON.stringify(products))
        //res.send(JSON.stringify(response))


        //console.log(products)

    }
    catch (error) {
        next(error)
    }
})

//Envío el array de productos inicial al cliente a través de socket
productRouter.get("/realtimeproducts", async (req, res, next) => {
    try {
        //const products = await productManager.getProducts()
        const products = await productModel.find()
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