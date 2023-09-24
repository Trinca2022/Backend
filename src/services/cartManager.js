import { cartModel } from '../persistencia/models/Cart.js'
import { logger } from "../utils/logger.js";
import { productMongo } from '../persistencia/DAOs/productMongo.js';
import { ProductManager } from './productManager.js';


//ACÁ CREAR UNA FUNCIÓN QUE ME SUME EL MONTO TOTAL DEL CARRITO

const productManager = new ProductManager()

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
        try {
            const cart = await cartModel.findById(id)
            if (!cart) { return "Carrito inexistente" }

            const product = cart.products.find(product => product.id_prod.toString() === id_prod)

            console.log("loco", product)

            //Me fijo si existe el producto en el carrito
            if (product) {
                //Existe el prodcuto -> Agrego +1 a la cantidad
                product.quantity++
                console.log("agrego cantidad 1")
            }
            else {
                //No existe el producto -> agrego el producto nuevo
                cart.products.push({ id_prod, quantity: 1 })
                console.log("hay que agregar el articulo")
            }
            await cartModel.updateOne({ "_id": id }, {
                $set: { "products": cart.products }
            })
            return
        }
        catch (error) {
            console.error('Error en la función addProductInCart:', error);
            throw error;
        }
    }

    //const productInCart = cart.products.find(product => product.id_prod.toString() === id_prod._id.toString())
    //const idProductInCart = productInCart.id_prod.toString()
    // const infoProdInCart = await productMongo.findOneById(idProductInCart)
    // const priceProdInCart = infoProdInCart.price
    //console.log("PRECIO PROD", priceProdInCart)

    /*
        async addProductInCart(id, id_prod) {
            try {
                const cart = await cartModel.findById(id)
                console.log("idcart", cart)
                if (!cart) { return "Carrito inexistente" }
                //Busco en ese cart el prod que tenga id_prod
                // const product = cart.products.find(product => product.id_prod.toString() === id_prod._id.toString())
                //const product = cart.products.find(product => product.id_prod.toString() === id_prod.toString())
                // console.log("product a comprar", product)
                const productInCart = cart.products.find(product => product.id_prod.toString() === id_prod._id.toString())
                if(!productInCart){}
                const idProductInCart = productInCart.id_prod.toString()
                const infoProdInCart = await productMongo.findOneById(idProductInCart)
                const priceProdInCart = infoProdInCart.price
                console.log("PRECIO PROD", priceProdInCart)
    
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
            catch (error) {
                console.error('Error en la función addProductInCart:', error);
                throw error;
            }
        }
    */
    /*
        async addProductInCart(id, id_prod) {
            try {
                const cart = await cartModel.findById(id)
                if (!cart) { return "Carrito inexistente" }
                const product = JSON.parse(JSON.stringify(cart.products.find(prod => prod.id_prod.toString() === id_prod)))
                /* console.log("accesoprod", product.id_prod)
                 const prodInCartID = product.id_prod
                 const infoProdInCart = await productManager.getProductById(prodInCartID)
                 const prodInCartPrice = infoProdInCart.price
                 console.log("priceeeee", prodInCartPrice)
                 let totalPriceProd = 0;
                 totalPriceProd += product.quantity * prodInCartPrice;
                 console.log("precio x prod", totalPriceProd)
                //const productPrice = product.price
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
            catch (error) {
                console.error('Error en la función addProductInCart:', error);
                throw error;
            }
        }*/
    /*
        async addProductInCart(id, id_prod) {
            try {
                const cart = await cartModel.findById(id)
                if (!cart) { return "Carrito inexistente" }
                const arrayCart = JSON.parse(JSON.stringify(cart.products))
                const product = arrayCart.find(product => product.id_prod === id_prod)
                console.log("prod", product)
    
                const productInCart = cart.products.find(product => product.id_prod.toString() === id_prod._id)
                //const idProductInCart = productInCart.id_prod.toString()
                // const infoProdInCart = await productMongo.findOneById(idProductInCart)
                // const priceProdInCart = infoProdInCart.price
                //console.log("PRECIO PROD", priceProdInCart)
    
                //Me fijo si existe el producto en el carrito
                if (product) {
                    //Existe el prodcuto -> Agrego +1 a la cantidad
                    product.quantity++
                    console.log("agrego cantidad 1")
                }
                else {
                    //No existe el producto -> agrego el producto nuevo
                    cart.products.push({ id_prod, quantity: 1 })
                    console.log("hay que agregar el articulo")
                }
                await cartModel.updateOne({ "_id": id }, {
                    $set: { "products": cart.products }
                })
                return
            }
            catch (error) {
                console.error('Error en la función addProductInCart:', error);
                throw error;
            }
        }*/


    async totalPriceProd(id, id_prod) {
        try {
            const cart = await cartModel.findById(id)
            if (!cart) { return "Carrito inexistente" }
            const prodInCart = JSON.parse(JSON.stringify(cart.products.find(prod => prod.id_prod.toString() === id_prod)))
            //console.log("accesoprod", product.id_prod)
            if (prodInCart) {
                const prodInCartID = product.id_prod
                const infoProdInCart = await productManager.getProductById(prodInCartID)
                const prodInCartPrice = infoProdInCart.price
                //console.log("priceeeee", prodInCartPrice)
                //console.log()
                let totalPriceProd = 0;
                totalPriceProd += prodInCart.quantity * prodInCartPrice;
                return totalPriceProd
            }
        }
        catch (error) {
            console.error('Error de cálculo precio x cantidad:', error);
            throw error;
        }
    }


    async totalPrice(id) {
        try {
            const cart = await cartModel.findById(id)
            if (!cart) { return "Carrito inexistente" }
            const productsInCart = JSON.parse(JSON.stringify(cart.products))
            //console.log("accesoprod", product.id_prod)

            const prodInCartID = product.id_prod
            const infoProdInCart = await productManager.getProductById(prodInCartID)
            const prodInCartPrice = infoProdInCart.price
            //console.log("priceeeee", prodInCartPrice)
            //console.log()
            let totalPriceProd = 0;
            totalPriceProd += prodInCart.quantity * prodInCartPrice;
            return totalPriceProd

        }
        catch (error) {
            console.error('Error de cálculo precio x cantidad:', error);
            throw error;
        }
    }

    //Método deleteProduct en Cart --> elimina producto con un ID existente
    async deleteProductInCart(id, id_prod) {
        const cart = await cartModel.findById(id)
        if (!cart) { return "Carrito inexistente" }
        const product = cart.products.find(product => product.id_prod.toString() === id_prod._id.toString())
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


    async totalPrice() {
        try {
            const productInCart = cart.products.find(product => product.id_prod.toString() === id_prod._id.toString())
            const idProductInCart = productInCart.id_prod.toString()
            const infoProdInCart = await productMongo.findOneById(idProductInCart)
            const priceProdInCart = infoProdInCart.price

        }
        catch (error) {
            logger.fatal(error.message, "Error")
        }
    }

}
