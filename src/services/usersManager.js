import { usersMongo } from '../persistencia/DAOs/usersMongo.js'


//Genero una clase UsersManager
export class UsersManager {
    constructor(path) {
        this.path = path
    }

    //Método getUsers--> busca todos los users
    async getUsers() {
        const usersFound = await usersMongo.findAll()
        if (usersFound) {
            return usersFound
        }
        else return "Usuarios no encontrados"
    }

    //Método getProductById --> busca un producto por su ID mongodb
    async getUserById(id) {
        const userFound = await usersMongo.findOneById(id)
        if (userFound) {
            return userFound
        }
        else return "User no encontrado"
    }

    //Método deleteProduct --> elimina producto con un ID existente
    async deleteUser(id) {
        const userFound = await usersMongo.findOneById(id)
        if (userFound) {
            await usersMongo.deleteOne({ "_id": id })
            return `El user cuyo id es ${userFound.id} se ha eliminado`
        }
    }
}