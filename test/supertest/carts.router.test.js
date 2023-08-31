import mongoose from "mongoose";
import { expect } from "chai";
import supertest from 'supertest'
import 'dotenv/config.js'
import { cartModel } from "../../src/persistencia/models/Cart.js";

export const dropCarts = async () => {
    await cartModel.collection.drop()
}

const requester = supertest(`http://localhost:${process.env.PORT_TEST}`)

before(async () => {
    await mongoose.connect(process.env.URL_MONGODB_ATLAS_TEST)
})

describe('Test routes Carts', () => {

    it('[POST] /cart CREO CARRITO', async () => {
        await dropCarts()
        const newCart = {
            products: []
        }
        const response = await requester.post('/cart').send(newCart)
        expect(response.statusCode).to.be.eql(200)
        console.log(response.body)
        expect(response.body.payload).to.be.ok
    })
})

