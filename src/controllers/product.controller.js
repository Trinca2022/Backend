import { productModel } from "../persistencia/models/Products.js";
import { ProductManager } from "../services/productManager.js";
import createError from "../services/errors/customError.js";
import errorTypes from "../services/errors/errorTypes.js";
import { generateProductErrorInfo } from "../services/errors/info.js";
import { sessionModel } from "../persistencia/models/Sessions.js";
import { userModel } from "../persistencia/models/Users.js";
import { productMongo } from "../persistencia/DAOs/productMongo.js";


//Utilizo las funciones creadas en los managers (services), para ejecutar req, res y enviarlo a la ruta
const productManager = new ProductManager()

//Manejo de la consulta con filtros que exporto a la ruta
export const productsFilterHandler = async (req, res, next) => {
    try {
        let { limit, page, status, sort } = req.query
        let hasPrevPage = true
        let hasNextPage = true

        limit = limit ?? 10
        page = page ?? 1
        status = status ?? true
        sort = sort ?? 0

        const products = await productModel.paginate({ status: status }, { limit: limit, page: page, sort: { price: sort } })

        if (page <= 1)
            hasPrevPage = false
        if (page >= 3)
            hasNextPage = false

        const response = {
            status: "success",
            docs: products,
            totalPages: 3,
            page: page,
            prevPage: Number(page) - 1,
            nextPage: Number(page) + 1,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage
        }
        res.send(response);
    }
    catch (error) {
        next(error)
    }
}

//Manejo de la vista de productos que exporto a la ruta
//Envío el array de productos inicial al cliente a través de socket
export const productsViewHandlerAdmin = async (req, res, next) => {
    try {
        const cartID = req.session.user.id_cart
        const isPremium = req.session.user.rol === "Premium"
        const adminOrPremiumEmail = req.session.user.email

        const products = await productModel.find()
        //Envío array al cliente para renderizar
        res.render('realtimeproductsAdmin', { adminOrPremiumEmail, cartID, isPremium, products: products, layout: 'mainrealtime' })
    }
    catch (error) {
        console.log(error)
        next(error)
    }
}

//Manejo de la vista de productos que exporto a la ruta
//Envío el array de productos inicial al cliente a través de socket
export const productsViewHandlerUser = async (req, res, next) => {
    try {
        const cartID = req.session.user.id_cart
        const products = await productModel.find()
        //Envío array al cliente para renderizar
        res.render('realtimeproductsUser', { cartID, products: products, layout: 'mainrealtimeUser' })
    }
    catch (error) {
        next(error)
    }
}

//Manejo búsqueda por ID que exporto a la ruta
export const getProductByIdHandler = async (req, res) => {
    const product = await productManager.getProductById(req.params.id)
    console.log(product)
    //res.send({ status: "success", payload: product });
    res.render('product', {
        title: product.title,
        description: product.description,
        price: product.price,
        code: product.code,
        stock: product.stock

    })
}

//Manejo búsqueda por ID que exporto a la ruta
export const getProductsHandler = async (req, res) => {
    try {
        //const products = await productManager.getProducts()
        const products = JSON.parse(JSON.stringify(await productModel.find()))
        //const prod = JSON.stringify(products)

        res.render('products', { products })
        //res.send(products);
        // res.send({ status: "success", payload: products, layout: 'products' });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los productos');
    }

}

//Manejo función que agrega producto y exporto a la ruta
export const addProductHandler = async (req, res, next) => {
    try {
        const { title, description, price, thumbnail, code, stock, status } = req.body
        if ((!title || !description || !price || !code || !stock)) {
            createError({
                name: "Error de creación de producto",
                cause: generateProductErrorInfo({ title, description, price, code, stock }),
                message: "Error al tratar de crear un nuevo producto",
                code: errorTypes.INVALID_TYPES_ERROR
            })
        }
        //Busco en la sesión actual el email para agregarlo
        const latestSession = await sessionModel.findOne().sort({ $natural: -1 }).exec();
        const data = JSON.parse(latestSession.session);
        const userDatos = data.user;
        const userEmail = userDatos.email;
        const prodNew = await productManager.addProduct({ title, description, price, thumbnail, code, stock, status, owner: userEmail })
        res.send(prodNew)
        //res.send({ status: "success", payload: prodNew });
    }
    catch (error) {
        next(error)

    }
}

//Manejo función que actualiza un producto y exporto a la ruta
export const updateProductHandler = async (req, res, next) => {
    try {
        const id = req.params.id
        const { title, description, price, thumbnail, code, stock, status } = req.body
        const mensaje = await productManager.updateProduct(id, { title, description, price, thumbnail, code, stock, status })
        res.send(mensaje)
    }
    catch (error) {
        next(error)

    }
}

//Manejo función que elimina un producto y exporto a la ruta
export const deleteProductHandler = async (req, res, next) => {
    try {
        const id = req.params.id
        //const mensaje = await productManager.deleteProduct(id)
        // res.send(mensaje)

        //Busco el rol del usuario actual
        const data = JSON.parse(latestSession.session);
        const userDatos = data.user;
        const userRol = userDatos.rol;
        //Busco el email del owner en la info del producto
        const product = await productManager.getProductById(_id)
        const prodOwnerEmail = product.owner
        //Busco el rol del usuario que creó el producto
        const users = await userModel.find()
        const prodOwner = users.find(user => user.email === prodOwnerEmail)
        const prodOwnerRol = prodOwner.rol
        //Si el rol de la sesión coincide con la del owner: borro prod
        //Si la sesión es de Admin: borro prod
        if (userRol === prodOwnerRol || userRol === "Administrador") {
            const mensaje = await productManager.deleteProduct(id)
            res.send(mensaje)
        }
        else {

            const alertScript = `
        <script>
            alert('Sin permiso para eliminar este producto');
            window.location.href = '/realtimeproductsAdmin';
        </script>
    `;

            res.send(alertScript);

        }

    }
    catch (error) {
        next(error)
    }
}