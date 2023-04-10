//SEGUNDO ENTREGABLE

import { promises as fs } from 'fs'

//Genero una clase ProductManager con el elemento products que es un array vacío y la ruta a info.txt
class ProductManager {
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
        const prods = JSON.parse(products)
        console.log(prods);
    }

    //Método getProductById --> busca un producto por su ID
    async getProductById(id) {
        const products = await fs.readFile(this.path, 'utf-8')
        const prods = JSON.parse(products)
        const productFound = prods.find(product => product.id === id)
        productFound ? console.log(productFound) : console.log('Not found')
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
class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

//Genero cada producto
const product1 = new Product("Café Colombiano", "Intensidad suave", 1200, "https://img.freepik.com/psd-premium/bolsa-papel-maqueta-cafe_23-2148884499.jpg?w=740", 1, 10)
const product2 = new Product("Café Brasilero", "Intensidad media", 1000, "https://img.freepik.com/psd-premium/bolsa-papel-maqueta-cafe_23-2148884499.jpg?w=740", 2, 10)
const product3 = new Product("Café Italiano", "Intensidad fuerte", 1500, "https://img.freepik.com/psd-premium/bolsa-papel-maqueta-cafe_23-2148884499.jpg?w=740", 3, 10)
//Producto de pueba al que le falta la descripción
const product4 = new Product("Café PRUEBA", 1500, "https://img.freepik.com/psd-premium/bolsa-papel-maqueta-cafe_23-2148884499.jpg?w=740", 4, 10)

//Instancio ProductManager CON LA RUTA
const productManager = new ProductManager('./info.txt')

//Instancio método para generar TXT con array vacío por única vez
await productManager.createTXT()

//Instancio método getProducts
await productManager.getProducts() //Array vacío

//Instancio método addProduct
await productManager.addProduct(product1, product1.code);
await productManager.addProduct(product2, product2.code);
await productManager.addProduct(product3, product3.code);
await productManager.addProduct(product4, product4.code); //Error: falta campo
await productManager.addProduct(product3, product3.code); //Error: el código ya existe

//Instancio método getProducts
await productManager.getProducts() //Array lleno

//Instancio método getProductById
await productManager.getProductById(4) //Not found
await productManager.getProductById(3) //Encuentra producto

//Instancio método updateProduct
await productManager.updateProduct(2,
    {
        title: "Café Brasilero Nuevo",
        description: "Intensidad media-alta",
        price: 1100,
        thumbnail: "https://img.freepik.com/psd-premium/bolsa-papel-maqueta-cafe_23-2148884499.jpg?w=740",
        code: 20,
        stock: 9
    }) //Actualiza el producto cuyo id es 2

//Instancio método deleteProduct
await productManager.deleteProduct(1) //Borra producto de id=1