import { productModel } from "../models/Products.js"

class ProductMongo {

    async createOne(obj) {
        try {
            const response = await productModel.create(obj)
            return response
        } catch (error) {
            return error
        }
    }
    async findAll() {
        try {
            const response = await productModel.find()
            return response
        } catch (error) {
            return error
        }
    }

    async findOneById(id) {
        try {
            const response = await productModel.findById(id)
            return response
        } catch (error) {
            return error
        }
    }
    async deleteOne(id) {
        try {
            const response = await productModel.deleteOne(id)//({ _id: id })
            return response
        } catch (error) {
            return error
        }
    }

    async updateOne(id, obj) {
        try {
            const response = await productModel.updateOne(id, obj)
            return response
        } catch (error) {
            return error
        }
    }

}


export const productMongo = new ProductMongo()