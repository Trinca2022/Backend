import mongoose from "mongoose";
import { expect } from "chai";
import supertest from 'supertest'
import 'dotenv/config.js'
import { userModel } from "../../src/persistencia/models/Users.js";

export const dropUsers = async () => {
    await userModel.collection.drop()
}

const requester = supertest(`http://localhost:${process.env.PORT_TEST}`)

before(async () => {
    await mongoose.connect(process.env.URL_MONGODB_ATLAS_TEST)
})

describe('Test routes sessions', () => {


    it('[POST] /register/register  register successfully', async () => {
        await dropUsers();
        const mockuser = {
            nombre: 'Prueba',
            apellido: 'Coder',
            email: 'correo@correo',
            edad: 50,
            password: '123456'
        }

        const response = await requester.post('/register/register').send(mockuser);
        //console.log(response)
        expect(response.statusCode).to.be.eql(200)
        console.log("NEW USER", response.body)
        expect(response.body.payload).to.be.ok
        expect(response.body.payload.nombre).to.be.eql('Prueba')
    })

})

