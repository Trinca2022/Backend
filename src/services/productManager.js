import { productModel } from '../persistencia/models/Products.js'
import { productMongo } from '../persistencia/DAOs/productMongo.js'

//Genero una clase ProductManager
export class ProductManager {
    constructor(path) {
        this.path = path
    }

    //Genero nuevo método createProduct que carga productos a mongodb
    async createProducts() {
        try {
            const prods = await productModel.find()
            if (prods.length === 0)
                await productModel.create([
                    { title: "Café Colombiano", description: "Intensidad suave", price: 1200, thumbnail: "https://img.freepik.com/psd-premium/bolsa-papel-maqueta-cafe_23-2148884499.jpg?w=740", code: 1, stock: 10, status: true },
                    { title: "Café Brasilero", description: "Intensidad media", price: 1000, thumbnail: "https://img.freepik.com/psd-premium/bolsa-papel-maqueta-cafe_23-2148884499.jpg?w=740", code: 2, stock: 10, status: true },
                    { title: "Café Italiano", description: "Intensidad fuerte", price: 1500, thumbnail: "https://img.freepik.com/psd-premium/bolsa-papel-maqueta-cafe_23-2148884499.jpg?w=740", code: 3, stock: 10, status: true },
                    { title: "Cafetera Italiana", description: "Hecha en aluminio. Pocillos: 9", price: 10000, thumbnail: "https://img.freepik.com/photos-premium/cafetera-moka-italiana-tradicional_739547-48.jpg?w=740", code: 4, stock: 10, status: true },
                    { title: "Cafetera Francesa", description: "Hecha en vidrio. Pocillos: 9", price: 6000, thumbnail: "https://img.freepik.com/photos-premium/cafetera-prensa-francesa-sobre-mesa-madera_52253-3241.jpg?w=740", code: 5, stock: 10, status: true },
                    { title: "Taza", description: "Hecha en cerámica", price: 2000, thumbnail: "https://img.freepik.com/photo-gratis/taza-cafe-patron-corazon-taza-blanca-sobre-fondo-madera-vintage-tono_1258-250.jpg?w=740&t=st=1675384318~exp=1675384918~hmac=61fa93b2fedbdf2e3e22406215c2d19ee3c306684ae21b4cd38aeea587c622a6", code: 6, stock: 10, status: true },
                    { title: "Pozillo", description: "Hecho en cerámica", price: 1200, thumbnail: "https://img.freepik.com/photo-gratis/taza-cafe_74190-2687.jpg?w=740&t=st=1675384164~exp=1675384764~hmac=54dbc88654ec2d5decca99058a299c7c4bf84ea698ca37be7c92ba2e0b5aeec0", code: 7, stock: 10, status: true },
                    { title: "Filtro", description: "De papel", price: 1000, thumbnail: "https://img.freepik.com/photo-gratis/alto-angulo-cafe-filtro_23-2148523007.jpg?w=740&t=st=1675384369~exp=1675384969~hmac=5fc8a13b41463f42b8bf1bd0f231e475a5f4bcbad337274fc00aa46b7af11b3b", code: 8, stock: 10, status: true },
                    { title: "Molinillo", description: "Con manija giratoria. Hecho en acrílico y acero inoxidable", price: 8000, thumbnail: "https://img.freepik.com/photo-gratis/granos-cafe-tazon-molinillo-cafe_23-2147711002.jpg?w=740&t=st=1675384446~exp=1675385046~hmac=dc160716b950665f92fd6202850f38d6bd2edcd85dfabb099a936b06f13342b3", code: 9, stock: 10, status: true },
                    { title: "Espumador", description: "A pila", price: 4000, thumbnail: "https://d3ugyf2ht6aenh.cloudfront.net/stores/001/180/130/products/whatsapp-image-2022-06-22-at-4-27-38-pm-11-d5790e6dc54be58ea316559355459674-640-0.jpeg", code: 10, stock: 10, status: true }
                ])


            else
                return

        }
        catch (error) {
            console.log(error)
        }
    }

    //Método addProduct --> con mongoose
    async addProduct(product, code) {
        try {
            const prods = await productMongo.findAll()
            //Validación de campo faltante
            if ((!product.title || !product.description || !product.price || !product.code || !product.stock || !product.status))
                console.log("Error: falta campo")
            //Validación de code repetido
            else if (prods.find(product => product.code === code))
                console.log(`Error: el código ${product.code} ya existe`)
            //Carga el nuevo producto
            else {
                prods.push(product)
            }
            const prodNew = await productMongo.createOne(prods)
            return prodNew
        }
        catch (error) {
            console.log(error)
        }
    }

    //Método getProductById --> busca un producto por su ID mongodb
    async getProductById(id) {
        const productFound = await productMongo.findOneById(id)
        if (productFound) {
            return productFound
        }
        else return "Producto no encontrado"
    }

    //Método getProducts --> busca todos los productos
    async getProducts() {
        const productsFound = await productMongo.findAll()
        if (productsFound) {
            return productsFound
        }
        else return "Productos no encontrados"
    }

    /*//Método updateProduct --> actualiza campo de un producto con un ID existente
    async updateProduct(id, { title, description, price, thumbnail, code, stock, status }) {
        const productFound = await productMongo.findOneById(id)
        if (productFound) {
            await productMongo.updateOne({ "_id": id }, {
                $set: {
                    "title": title,
                    "description": description,
                    "price": price,
                    "thumbnail": thumbnail,
                    "code": code,
                    "stock": stock,
                    "status": status
                }
            })

            await productMongo.createOne()
            return (`El producto cuyo id es ${productFound.id} se ha actualizado`)
        }
        else
            return 'Not found'
    }*/

    async updateProduct(id, {
        title, description, price, thumbnail, code, stock, status }) {
        try {
            const updatedProd = await productModel.findOneAndUpdate(
                { "_id": id }, {
                $set: {
                    "title": title,
                    "description": description,
                    "price": price,
                    "thumbnail": thumbnail,
                    "code": code,
                    "stock": stock,
                    "status": status
                }
            },
                { new: true } // Devuelve el documento actualizado
            );

            if (updatedProd) {
                return updatedProd;
            } else {
                return 'Producto no encontrado.';
            }
        } catch (error) {
            console.error('Error:', error);
            return 'Ha ocurrido un error al actualizar el producto.';
        }
    }



    //Método deleteProduct --> elimina producto con un ID existente
    async deleteProduct(id) {
        const productFound = await productMongo.findOneById(id)
        if (productFound) {
            await productMongo.deleteOne({ "_id": id })
            return (`El producto cuyo id es ${productFound.id} se ha eliminado`)
        }
        else {
            return productFound
        }
    }

}



