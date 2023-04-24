import { promises as fs } from 'fs'

export class CartManager {
    constructor(path) {
        this.path = path
    }

    static incrementarID() {
        if (this.idIncrement) {
            this.idIncrement++
        } else {
            this.idIncrement = 1
        }
        return this.idIncrement
    }

    async createCarrito() {
        const cartsJSON = await fs.readFile(this.path, 'utf-8')
        const carts = JSON.parse(cartsJSON)
        const carrito = {
            cid: CartManager.incrementarID(),
            products: []
        }
        carts.push(carrito)
        await fs.writeFile(this.path, JSON.stringify(carts))
        return "Carrito creado"
    }


    async getCartById(cid) {
        const cartsJSON = await fs.readFile(this.path, 'utf-8')
        const carts = JSON.parse(cartsJSON)
        const cartFound = carts.find(cart => cart.cid === parseInt(cid))
        if (cartFound) { return cartFound } else {
            return "Carrito no encontrado"
        }
    }


    async addProductCart(cid, pid) {
        const cartsJSON = await fs.readFile(this.path, 'utf-8')
        const carts = JSON.parse(cartsJSON)
        const cart = carts.find(cart => cart.cid === parseInt(cid))
        if (!cart) { return "Carrito inexistente" }
        const product = cart.products.find(product => product.pid === parseInt(pid))
        //Me fijo si existe el producto en el carrito
        if (product) {
            //Existe el prodcuto -> Agrego +1 a la cantidad
            product.quantity++
        }
        else {
            //No existe el producto -> agrego el producto nuevo
            cart.products.push({ pid, quantity: 1 })
        }
        await fs.writeFile(this.path, JSON.stringify(carts))
        return "Producto agregado"
    }

}

