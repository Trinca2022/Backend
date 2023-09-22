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
}

export const usersMongo = new UsersMongo()