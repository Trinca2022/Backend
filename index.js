//PRIMER ENTREGABLE

//Genero una clase ProductManager con el elemento products que es un array vacío
class ProductManager {
    constructor() {
        this.products = []
    }

    //Método addProduct --> valida y pushea
    addProduct(product, code) {
        //Validación de campo faltante
        if ((product.title && product.description && product.price && product.thumbnail && product.code && product.stock) === undefined)
            console.log("Error: falta campo")
        //Validación de code repetido
        else if (this.products.find(product => product.code === code))
            console.log(`Error: el código ${product.code} ya existe`)
        //Carga de productos
        else {
            this.products.push(product)
            //Genero ID autoincrementable
            for (let i = 1; i <= this.products.length; i++) {
                product.id = i
            }
        }

        //Validación de campos obligatorios + validación de código
        /*if ((product.title && product.description && product.price && product.thumbnail && product.code && product.stock) !== undefined) {
            if (this.products.find(product => product.code === code)) {
                console.log(`El código ${product.code} ya existe`)
            }
            //Pusheo productos
            else {
                this.products.push(product)
                //Genero ID autoincrementable
                for (let i = 1; i <= this.products.length; i++) {
                    product.id = i
                }
            }
        }
        else {
            console.log("Error al cargar producto: falta campo")
        }*/
    }

    //Método getProducts --> devuelve el array
    getProducts() {
        return this.products;
    }

    //Método getProductById --> busca un producto por su ID
    getProductById(id) {
        const productFound = this.products.find(product => product.id === id)
        if (productFound) {
            console.log(productFound)
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

//Instancio ProductManager
const productManager = new ProductManager()

//Instancio método addProduct
productManager.addProduct(product1, product1.code);
productManager.addProduct(product2, product2.code);
productManager.addProduct(product3, product3.code);
productManager.addProduct(product4, product4.code); //Error: falta campo
productManager.addProduct(product3, product3.code); //Error: el código ya existe

//Instancio método getProducts
console.log(productManager.getProducts())

//Instancio método getProductById
productManager.getProductById(4) //Not found
productManager.getProductById(2) //Encuentra producto
