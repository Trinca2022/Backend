import { productModel } from "../persistencia/models/Products.js";
import { ProductManager } from "../services/productManager.js";
import createError from "../services/errors/customError.js";
import errorTypes from "../services/errors/errorTypes.js";
import { generateProductErrorInfo } from "../services/errors/info.js";

//Utilizo las funciones creadas en los managers (services), para ejecutar req, res y enviarlo a la ruta
const productManager = new ProductManager()

//Manejo de la consulta con filtros que exporto a la ruta
export const productsFilterHandler = async (req, res, next) => {
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
        if (page >= 3)
            hasNextPage = false

        const response = {
            status: "success",
            docs: products,
            totalPages: 3,
            page: page,
            prevPage: Number(page) - 1,
            nextPage: Number(page) + 1,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage
        }
        res.send(response)
    }
    catch (error) {
        next(error)
    }
}

//Manejo de la vista de productos que exporto a la ruta
//Envío el array de productos inicial al cliente a través de socket
export const productsViewHandlerAdmin = async (req, res, next) => {
    try {
        const products = await productModel.find()
        //Envío array al cliente para renderizar
        res.render('realtimeproductsAdmin', { products: products, layout: 'mainrealtime' })
    }
    catch (error) {
        next(error)
    }
}

//Manejo de la vista de productos que exporto a la ruta
//Envío el array de productos inicial al cliente a través de socket
export const productsViewHandlerUser = async (req, res, next) => {
    try {
        const products = await productModel.find()
        //Envío array al cliente para renderizar
        res.render('realtimeproductsUser', { products: products, layout: 'mainrealtimeUser' })
    }
    catch (error) {
        next(error)
    }
}

//Manejo búsqueda por ID que exporto a la ruta
export const getProductByIdHandler = async (req, res) => {
    const product = await productManager.getProductById(req.params.id)
    res.render('product', {
        title: product.title,
        description: product.description,
        price: product.price,
        code: product.code,
        stock: product.stock

    })
}

//Manejo función que agrega producto y exporto a la ruta
export const addProductHandler = async (req, res, next) => {
    try {
        const { title, description, price, thumbnail, code, stock, status } = req.body
        if ((!title || !description || !price || !code || !stock)) {
            createError({
                name: "Error de creación de producto",
                cause: generateProductErrorInfo({ title, description, price, code, stock }),
                message: "Error al tratar de crear un nuevo producto",
                code: errorTypes.INVALID_TYPES_ERROR
            })
        }
        const prodNew = await productManager.addProduct({ title, description, price, thumbnail, code, stock, status })
        res.send(prodNew)
    }
    catch (error) {
        next(error)

    }
}

//Manejo función que actualiza un producto y exporto a la ruta
export const updateProductHandler = async (req, res) => {
    const id = req.params.id
    const { title, description, price, thumbnail, code, stock, status } = req.body
    const mensaje = await productManager.updateProduct(id, { title, description, price, thumbnail, code, stock, status })
    res.send(mensaje)
}

//Manejo función que elimina un producto y exporto a la ruta
export const deleteProductHandler = async (req, res) => {
    const id = req.params.id

    //const { id } = req.body
    const mensaje = await productManager.deleteProduct(id)
    res.send(mensaje)
}