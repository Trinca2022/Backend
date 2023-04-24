
import { promises as fs } from 'fs'

//Genero una clase ProductManager con el elemento products que es un array vacío y la ruta a info.txt
export class ProductManager {
    constructor(path) {
        this.path = path
        //this.products = []
    }

    /*//Método createTXT --> crea el TXT y guarda el array vacío
    async createTXT() {
        await fs.writeFile(this.path, JSON.stringify(this.products))
    }*/

    //Método addProduct --> consulta el TXT, valida y pushea productos en TXT
    async addProduct(product, code) {
        try {
            //Consulto TXT para poder validar
            const products = await fs.readFile(this.path, 'utf-8')
            const prods = JSON.parse(products)
            //Validación de campo faltante
            if ((product.title && product.description && product.price && product.code && product.stock && product.status) === undefined)
                console.log("Error: falta campo")
            //Validación de code repetido
            else if (prods.find(product => product.code === code))
                console.log(`Error: el código ${product.code} ya existe`)
            //Carga de productos
            else {
                prods.push(product)
                for (let i = 1; i <= prods.length; i++) {
                    product.id = i
                }
                await fs.writeFile(this.path, JSON.stringify(prods))
                return "Producto creado"
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    //Método getProducts --> devuelve el array
    async getProducts() {
        const products = await fs.readFile(this.path, 'utf-8')
        return JSON.parse(products);
    }

    //Método getProductById --> busca un producto por su ID
    async getProductById(id) {
        const products = await fs.readFile(this.path, 'utf-8')
        const prods = JSON.parse(products)
        const productFound = prods.find(product => product.id === parseInt(id))
        if (productFound) {
            return productFound
        }
        else return "Producto no encontrado"
    }

    //Método updateProduct --> actualiza campo de un producto con un ID existente
    async updateProduct(id, { title, description, price, thumbnail, code, stock, status }) {
        const products = await fs.readFile(this.path, 'utf-8')
        const prods = JSON.parse(products)
        const productFound = prods.find(product => product.id === parseInt(id))
        if (productFound) {
            productFound.title = title;
            productFound.description = description;
            productFound.price = price;
            productFound.thumbnail = thumbnail;
            productFound.code = code;
            productFound.stock = stock;
            productFound.status = status;
            await fs.writeFile(this.path, JSON.stringify(prods))
            return (`El producto cuyo id es ${productFound.id} se ha actualizado`)
        }
        else
            return 'Not found'
    }



    //Método deleteProduct --> elimina producto con un ID existente
    async deleteProduct(id) {
        const products = await fs.readFile(this.path, 'utf-8')
        const prods = JSON.parse(products)
        const productFound = prods.find(product => product.id === parseInt(id))
        if (productFound) {
            const deleteIndex = prods.indexOf(productFound)
            prods.splice(deleteIndex, 1)
            await fs.writeFile(this.path, JSON.stringify(prods))
            return (`El producto cuyo id es ${productFound.id} se ha eliminado`)
        }
        else {
            return productFound
        }
    }
}

