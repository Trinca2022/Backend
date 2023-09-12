import { sessionModel } from "../persistencia/models/Sessions.js";

export class SessionManager {
    constructor(path) {
        this.path = path
    }

    //Método para buscar en sesión activa y devuelve el id
    async findIdSession() {
        try {
            const latestSession = await sessionModel.findOne().sort({ $natural: -1 }).exec();
            if (latestSession) {
                const data = JSON.parse(latestSession.session);
                const userDatos = data.user;
                const _id = userDatos._id;
                return _id
            }
        }
        catch (error) {
            console.error('Error:', error);
            return 'Error al buscar el _id';
        }
    }

}