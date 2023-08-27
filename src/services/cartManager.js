import { cartModel } from '../persistencia/models/Cart.js'
import { logger } from "../utils/logger.js";


//ACÁ CREAR UNA FUNCIÓN QUE ME SUME EL MONTO TOTAL DEL CARRITO

export class CartManager {
    constructor(path) {
        this.path = path
    }

    async createCart() {
        try {
            const carts = await cartModel.find()
            if (carts.length === 0) {
                await cartModel.create({})
                return "Carrito creado"
            }
            else return
        }
        catch (error) {
            logger.fatal(error.message, "Error al crear carrito")
        }
    }

    //Crea carrito sin restricciones y sin necesidad de usuario
    async createOneCart() {
        try {
            const newCart = await cartModel.create({})
            return newCart
        }
        catch (error) {
            logger.fatal(error.message, "Error al crear carrito")
        }
    }

    async getCartById(id) {
        const cartFound = await cartModel.findById(id).populate("products.id_prod")
        //const cartFoundJSON = JSON.stringify(cartFound)
        if (cartFound) {
            return cartFound
        }
        else {
            return "Carrito no encontrado"
        }
    }

    //sin populate
    async findOneById(id) {
        try {
            const response = await cartModel.findById(id)
            return response
        } catch (error) {
            return error
        }
    }


    async findAll() {
        try {
            const response = await cartModel.find()
            return response
        } catch (error) {
            return error
        }
    }

    async addProductInCart(id, id_prod) {
        const cart = await cartModel.findById(id)
        if (!cart) { return "Carrito inexistente" }
        const product = cart.products.find(product => product.id_prod.toString() === id_prod)
        //Me fijo si existe el producto en el carrito
        if (product) {
            //Existe el prodcuto -> Agrego +1 a la cantidad
            product.quantity++
        }
        else {
            //No existe el producto -> agrego el producto nuevo
            cart.products.push({ id_prod, quantity: 1 })
        }
        await cartModel.updateOne({ "_id": id }, {
            $set: { "products": cart.products }
        })
        return
    }

    //Método deleteProduct en Cart --> elimina producto con un ID existente
    async deleteProductInCart(id, id_prod) {
        const cart = await cartModel.findById(id)
        if (!cart) { return "Carrito inexistente" }
        const product = cart.products.find(product => product.id_prod.toString() === id_prod)
        if (product) {
            const deleteIndex = cart.products.indexOf(product)
            cart.products.splice(deleteIndex, 1)
            await cartModel.updateOne({ "_id": id }, {
                $set: { "products": cart.products }
            })
            return (`El producto cuyo id es ${id_prod
                } se ha eliminado`)
        }
        else {
            return ("Producto inexistente")

        }
    }
    //Método putProductCart de Product en Cart --> modifica la cantidad del producto con ID Existente en el Cart
    async updateProductInCart(id, id_prod, quant) {
        const cart = await cartModel.findById(id)
        const newQuantity = quant.quantity
        if (!cart) { return "Carrito inexistente" }
        const product = cart.products.find(product => product.id_prod.toString() === id_prod)
        //Me fijo si existe el producto en el carrito
        if (product) {
            //Existe el prodcuto -> actualizo la cantidad segun el body
            product.quantity = newQuantity

        }
        else {
            //No existe el producto
            return (`El producto cuyo id es ${id_prod
                } no existe`)
        }
        await cartModel.updateOne({ "_id": id }, {
            $set: { "products": cart.products }
        })
        return
    }

    //Método deleteProducts en Cart --> vacía carrito
    async deleteProductsInCart(id) {
        const cart = await cartModel.findById(id)
        if (!cart) { return "Carrito inexistente" }
        else {
            await cartModel.updateOne({ "_id": id }, {
                $set: { "cart": {} }
            })
            return (`Carrito vaciado`)
        }
    }

    //Método putCart--> actualiza cart según body
    async updateCart(id, newProducts) {
        const cart = await cartModel.findById(id)
        if (!cart) { return "Carrito inexistente" }
        //Me fijo si existe el producto en el carrito
        await cartModel.updateOne({ "_id": id }, {
            $set: { "products": newProducts }
        })
        return
    }

}
