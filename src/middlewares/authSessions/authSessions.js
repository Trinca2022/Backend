//Autenticación para poder acceder a la vista de productos
export const authAdminOrPrem = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/sessions/logout');
    }
    const { rol } = req.session.user
    if (rol === "Administrador" || "Premium") {
        return next()
    }
    return res.redirect('/sessions/logout');
}


//Autenticación para poder acceder a la vista de productos
export const authUser = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/sessions/logout')
    }
    const { rol } = req.session.user
    if (rol === "Usuario") {
        return next()
    }
    return res.redirect('/sessions/logout');
}

//Autenticación para poder acceder a la vista de productos
export const authUserOrPrem = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/sessions/logout');
    }
    const { rol } = req.session.user
    if (rol === "Usuario" || "Premium") {
        return next()
    }
    return res.redirect('/sessions/logout');
}
