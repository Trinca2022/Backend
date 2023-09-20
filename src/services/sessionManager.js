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

    /*// Método para buscar en sesión activa y devuelve el campo "rol"
    async findRolInSession() {
        try {
            const latestSession = await sessionModel.findOne().sort({ $natural: -1 }).exec();
            if (latestSession) {
                const data = JSON.parse(latestSession.session);
                const user = data.user;
                const rol = user.rol;
                return rol;
            }
        } catch (error) {
            console.error('Error:', error);
            return 'Error al buscar el rol en la sesión';
        }
    }


    async updateRolInSession(rol) {
        try {
            const latestSession = await sessionModel.findOne().sort({ $natural: -1 }).exec();
            if (latestSession) {
                const data = JSON.parse(latestSession.session);
                data.user.rol = rol; // Actualiza el campo "rol"

                // Ahora, actualiza la sesión en la base de datos con el objeto data completo
                const newRol = await sessionModel.updateOne(
                    { _id: data.user._id },
                    { $set: { "session": JSON.stringify(data) } }
                );

                console.log("ROL SESS MANAGER", newRol);
            }
        } catch (error) {
            console.error('Error:', error);
            return 'Ha ocurrido un error al actualizar el rol en la sesión';
        }
    }

*/


    //Método updateUser 
    /*async updateRolInSession(rol) {
        try {
            const _id = await this.findIdSession()

            const updatedRolInSession = await sessionModel.updateOne(
                { _id }, {
                $set: {
                    "JSON.parse(latestSession.session).user.rol": rol

                }
            }

            );
            console.log("ROL UPD", updatedRolInSession)
        }

        catch (error) {
            console.error('Error:', error);
            return 'Ha ocurrido un error al actualizar el rol en la sesión';
        }
    }*/


}