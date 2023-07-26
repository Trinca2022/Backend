export const generateUserErrorInfo = (user) => {
    return `Una o más propiedades están incompletas. Lista de propiedades requeridas:
    * nombre : debe ser string, recibido ${user.nombre}
    * apellido : debe ser string, recibido ${user.apellido}
    * email : debe ser string, recibido ${user.email}
    * edad : debe ser number, recibido ${user.edad}
    `
}

export const generateProductErrorInfo = (prod) => {
    return `Una o más propiedades están incompletas. Lista de propiedades requeridas:
    * title : debe ser string, recibido ${prod.title}
    * description : debe ser string, recibido ${prod.description}
    * price : debe ser number, recibido ${prod.price}
    * code : debe ser number, recibido ${prod.code}
    * stock : debe ser number, recibido ${prod.stock}
    `
}