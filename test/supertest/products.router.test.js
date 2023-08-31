import mongoose from "mongoose";
import { expect } from "chai";
import supertest from 'supertest'
import 'dotenv/config.js'


const requester = supertest(`http://localhost:${process.env.PORT_TEST}`)

before(async () => {
    await mongoose.connect(process.env.URL_MONGODB_ATLAS_TEST)
})

describe('Test routes Products', () => {

    it('[GET] /product GET ALL PRODUCTS', async () => {
        const response = await requester.get('/products')
        expect(response.statusCode).to.be.eql(200)
        expect(response.body).to.be.an('object');
        expect(response.body).not.to.be.null
        //console.log("GET PRODS:", response.body)
    })
})

it('[GET] /product/:id GET by ID', async () => {
    const productId = "64ee8694b8f834efbc464fd0";
    const response = await requester.get(`/product/${productId}`);
    expect(response.statusCode).to.be.eql(200);
    console.log("GET BY ID", response.body.payload._id)
    expect(response.body).to.be.an('object');
    expect(response.body.payload._id).to.equal(productId);

})


it('[POST] /product', async () => {
    const mockprod = {
        title: "Café Italiano TEST",
        description: "Intensidad fuerte",
        price: 1500,
        thumbnail: "https://img.freepik.com/psd-premium/bolsa-papel-maqueta-cafe_23-2148884499.jpg?w=740",
        code: 31,
        stock: 10,
        status: true
    }
    const response = await requester.post('/product').send(JSON.stringify(mockprod));
    //console.log(response)
    expect(response.statusCode).to.be.eql(200)
    expect(response.body).to.be.ok
    console.log("POST PROD", response.body)

})


