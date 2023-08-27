import { cartModel } from "../../src/persistencia/models/Cart.js";
import { CartManager } from "../../src/services/cartManager.js";
import mongoose from "mongoose";
import config from "../../src/config/config.js";


import chai from "chai";
const expect = chai.expect;

mongoose.connect(config.URL_MONGODB_ATLAS)


describe("Pruebas de carritos con chai", async function () {
    this.timeout(5000)

    before(async function () {
        this.cartManager = new CartManager()

    })

    beforeEach(async function () {
        await cartModel.deleteMany()
    })

    it("Consultar con método getAll", async function () {
        const result = await this.cartManager.findAll();
        expect(result).deep.equal([])
    })

    it("Creo un carrito", async function () {
        const newCart = {
            products: []
        }

        const result = await this.cartManager.createOneCart(newCart);
        expect(result).to.have.property('_id')
    })

    it("Creo un carrito con PROD", async function () {
        const newCart = {
            products: [{
                title: "Café Italiano Test",
                description: "Intensidad fuerte",
                price: 1500,
                thumbnail: "https://img.freepik.com/psd-premium/bolsa-papel-maqueta-cafe_23-214888…",
                code: 30,
                stock: 10
            }]
        }

        const result = await this.cartManager.createOneCart(newCart);
        expect(result).to.have.property('_id')
        expect(result.products.title).to.be.equal(newCart.products.title)
    })


    it("Prueba método DELETE", async function () {
        const newCart = {
            products: [{
                title: "Café Italiano Test",
                description: "Intensidad fuerte",
                price: 1500,
                thumbnail: "https://img.freepik.com/psd-premium/bolsa-papel-maqueta-cafe_23-214888…",
                code: 30,
                stock: 10
            }]
        }
        const result = await this.cartManager.createOneCart(newCart);
        expect(result).to.have.property('_id')
        expect(result.products.title).to.be.equal(newCart.products.title)
        await this.cartManager.deleteProductsInCart(result._id)
        const cart = await this.cartManager.findOneById(result._id)
        expect(cart).to.have.property('_id')
        expect(cart.products.title).to.be.equal(undefined)
    })

    after(async function () {
        await cartModel.deleteMany()
    })


})
