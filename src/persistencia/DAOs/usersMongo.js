import { userModel } from "../models/Users.js"

class UsersMongo {

    async findAll() {
        try {
            const response = await userModel.find()

            return response
        } catch (error) {
            return error
        }
    }

    async findOneById(id) {
        try {
            const response = await userModel.findById(id)
            return response
        } catch (error) {
            return error
        }
    }

    async deleteOne(id) {
        try {
            const response = await userModel.deleteOne({ "_id": id })
            return response
        } catch (error) {
            return error
        }
    }


}



export const usersMongo = new UsersMongo()