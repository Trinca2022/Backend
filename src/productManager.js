
import { promises as fs } from 'fs'

//Genero una clase ProductManager con el elemento products que es un array vacío y la ruta a info.txt
export class ProductManager {
    constructor(path) {
        this.path = path
        this.products = []
    }

    //Método createTXT --> crea el TXT y guarda el array vacío
    async createTXT() {
        await fs.writeFile(this.path, JSON.stringify(this.products))
    }

    //Método addProduct --> consulta el TXT, valida y pushea productos en TXT
    async addProduct(product, code) {
        try {
            //Consulto TXT para poder validar
            const products = await fs.readFile(this.path, 'utf-8')
            const prods = JSON.parse(products)
            //Validación de campo faltante
            if ((product.title && product.description && product.price && product.thumbnail && product.code && product.stock) === undefined)
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
    async updateProduct(id, { title, description, price, thumbnail, code, stock }) {
        const products = await fs.readFile(this.path, 'utf-8')
        const prods = JSON.parse(products)
        const productFound = prods.find(product => product.id === id)
        if (productFound) {
            productFound.title = title;
            productFound.description = description;
            productFound.price = price;
            productFound.thumbnail = thumbnail;
            productFound.code = code;
            productFound.stock = stock;
            await fs.writeFile(this.path, JSON.stringify(prods))
            console.log(`El producto cuyo id es ${productFound.id} se ha actualizado`)
        }
        else
            console.log('Not found')

    }

    //Método deleteProduct --> elimina producto con un ID existente
    async deleteProduct(id) {
        const products = await fs.readFile(this.path, 'utf-8')
        const prods = JSON.parse(products)
        const productFound = prods.find(product => product.id === id)
        if (productFound) {
            const deleteIndex = prods.indexOf(productFound)
            prods.splice(deleteIndex, 1)
            await fs.writeFile(this.path, JSON.stringify(prods))
            console.log(`El producto cuyo id es ${productFound.id} se ha eliminado`)
        }
        else {
            console.log('Not found')
        }
    }
}

//Genero otra clase que contiene las propiedades de los productos
export class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

