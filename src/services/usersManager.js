import { usersMongo } from '../persistencia/DAOs/usersMongo.js'


//Genero una clase UsersManager
export class UsersManager {
    constructor(path) {
        this.path = path
    }



    //Método getProducts--> busca todos los productos
    async getProducts() {
        const usersFound = await usersMongo.findAll()
        if (usersFound) {
            return usersFound
        }
        else return "Usuarios no encontrados"
    }
}