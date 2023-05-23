import { cartModel } from './models/Cart.js'

export class CartManager {
    constructor(path) {
        this.path = path
    }

    async createCarrito() {
        try {
            await cartModel.create({})
            return "Carrito creado"
        }
        catch (error) {
            console.log(error)
        }
    }

    async getCartById(id) {
        const cartFound = await cartModel.findById(id)
        if (cartFound) {
            return cartFound
        }
        else {
            return "Carrito no encontrado"
        }
    }

    async addProductCart(id, id_prod) {
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
}
