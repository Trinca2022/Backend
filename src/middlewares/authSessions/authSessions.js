//Autenticación para poder acceder a la vista de productos
export const authAdminOrPrem = (req, res, next) => {
    if (!req.session.user)
        //return res.send("Error de autenticación")
        return res.redirect('/sessions/login');
    const { rol } = req.session.user
    if (rol === "Administrador" || "Premium") return next()
}


//Autenticación para poder acceder a la vista de productos
export const authUser = (req, res, next) => {
    if (!req.session.user)
        // return res.send("Error de autenticación")
        return res.redirect('/sessions/login');
    const { rol } = req.session.user
    if (rol === "Usuario") return next()
}