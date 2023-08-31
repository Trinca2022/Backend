import { productModel } from "../../src/persistencia/models/Products.js";
import { productMongo } from "../../src/persistencia/DAOs/productMongo.js";
import mongoose from "mongoose";
import 'dotenv/config.js'


import chai from "chai";
const expect = chai.expect;

mongoose.connect(process.env.URL_MONGODB_ATLAS_TEST)


describe("Pruebas de productos con chai", async function () {
    this.timeout(5000)

    before(async function () {
        this.productMongo = productMongo

    })

    beforeEach(async function () {
        await productModel.deleteMany()
    })

    it("Consultar con método get/findAll", async function () {
        const result = await this.productMongo.findAll();
        expect(result).deep.equal([])
    })

    it("Agregar un producto", async function () {
        const newProd = {
            title: "Café Italiano Test",
            description: "Intensidad fuerte",
            price: 1500,
            thumbnail: "https://img.freepik.com/psd-premium/bolsa-papel-maqueta-cafe_23-214888…",
            code: 30,
            stock: 10
        }
        const result = await this.productMongo.createOne(newProd);
        expect(result).to.have.property('_id')
        expect(result.title).to.be.equal(newProd.title)
    })

    it("Consultar producto por una propiedad", async function () {
        const newProd = {
            title: "Café Italiano Test",
            description: "Intensidad fuerte",
            price: 1500,
            thumbnail: "https://img.freepik.com/psd-premium/bolsa-papel-maqueta-cafe_23-214888…",
            code: 30,
            stock: 10
        }
        const result = await this.productMongo.createOne(newProd);
        const prodCode = await this.productMongo.findOneBy({ code: 30 })
        expect(result).to.have.property('_id')
        expect(prodCode.code).to.be.equal(newProd.code)
    })

    it("Prueba método update", async function () {
        const newProd = {
            title: "Café Italiano Test",
            description: "Intensidad fuerte",
            price: 1500,
            thumbnail: "https://img.freepik.com/psd-premium/bolsa-papel-maqueta-cafe_23-214888…",
            code: 30,
            stock: 10
        }
        const result = await this.productMongo.createOne(newProd);

        expect(result).to.have.property('_id')
        expect(result.title).to.be.equal("Café Italiano Test")

        const updateProd = await this.productMongo.updateOneById(result._id, {
            title: "Café Italiano Test 1"
        })

        const prod = await this.productMongo.findOneById({ _id: result._id })
        expect(prod).to.have.property('_id')

        expect(prod.title).to.be.equal("Café Italiano Test 1")

    })


    it("Prueba método DELETE", async function () {
        const newProd = {
            title: "Café Italiano Test",
            description: "Intensidad fuerte",
            price: 1500,
            thumbnail: "https://img.freepik.com/psd-premium/bolsa-papel-maqueta-cafe_23-214888…",
            code: 30,
            stock: 10
        }
        const result = await this.productMongo.createOne(newProd);
        expect(result).to.have.property('_id')
        await this.productMongo.deleteOne(result._id)
        const prod = await this.productMongo.findOneById({ _id: result._id })
        expect(prod).to.be.equal(null)
    })

    after(async function () {
        await productModel.deleteMany()
    })


})
