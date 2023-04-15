import express from 'express'

import { ProductManager, Product } from './productManager.js'

const app = express()
const PORT = 4000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const productManager = new ProductManager('./product.txt')

//await productManager.createTXT()

const product1 = new Product("Café Colombiano", "Intensidad suave", 1200, "https://img.freepik.com/psd-premium/bolsa-papel-maqueta-cafe_23-2148884499.jpg?w=740", 1, 10)
const product2 = new Product("Café Brasilero", "Intensidad media", 1000, "https://img.freepik.com/psd-premium/bolsa-papel-maqueta-cafe_23-2148884499.jpg?w=740", 2, 10)
const product3 = new Product("Café Italiano", "Intensidad fuerte", 1500, "https://img.freepik.com/psd-premium/bolsa-papel-maqueta-cafe_23-2148884499.jpg?w=740", 3, 10)

await productManager.addProduct(product1, product1.code);
await productManager.addProduct(product2, product2.code);
await productManager.addProduct(product3, product3.code);



app.get("/product", async (req, res) => {
    const products = await productManager.getProducts()
    res.send(products)
})

app.get('/', (req, res) => {
    res.send("Mi primer servidor")
})





app.get("/product/:id", async (req, res) => {
    const product = await productManager.getProductById(req.params.id)
    res.send(product)
})





app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})
