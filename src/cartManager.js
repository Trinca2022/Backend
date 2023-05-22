import { cartModel } from './models/Cart.js'
import { productModel } from './models/Products.js'

export class CartManager {
    constructor(path) {
        this.path = path
    }

    async createCarrito() {
        try {
            const carts = await cartModel.find()
            if (carts.length === 0) {
                await cartModel.create([
                    { "products": [{ id_prod: "646aca7bea45f354ebd46cdf", "quantity": "1" }, { id_prod: "646aca7bea45f354ebd46ce3", "quantity": "1" }] }
                ])
                return "Carrito creado"
            }
            else return
        }
        catch (error) {
            console.log(error)
        }
    }

    async getCartById(cid) {
        const cartFound = await cartModel.findById(cid)
        if (cartFound) {
            return cartFound
        }
        else {
            return "Carrito no encontrado"
        }
    }


    async addProductCart(id, id_prod) {
        const carts = await cartModel.find()
        const cart = await cartModel.findById(id)
        if (!cart) { return "Carrito inexistente" }
        const product = await productModel.findById(id_prod)
        //Me fijo si existe el producto en el carrito
        if (product) {
            //Existe el prodcuto -> Agrego +1 a la cantidad
            product.quantity++
        }
        else {
            //No existe el producto -> agrego el producto nuevo
            cart.products.push({ id_prod, quantity: 1 })
        }
        await cartModel.create(carts)
        return "Producto agregado"
    }

}

/*await cartModel.create(
         [
         { "products": [{ "id_prod": "646aca7bea45f354ebd46cdf", "quantity": "1" }, { id_prod: "646aca7bea45f354ebd46ce3", "quantity": "1" }] }
     ])
     
     {"products": [{ "id_prod": "646aca7bea45f354ebd46cdf", "quantity": "1"]}*/