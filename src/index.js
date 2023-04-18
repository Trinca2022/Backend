import express from 'express'

import { ProductManager, Product } from './productManager.js'

//Configuro express
const app = express()
const PORT = 4000
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const productManager = new ProductManager('./product.txt')

//Instancio método para crear TXT
await productManager.createTXT()

//Creo productos e instancio método para agregarlos al array de TXT
const product1 = new Product("Café Colombiano", "Intensidad suave", 1200, "https://img.freepik.com/psd-premium/bolsa-papel-maqueta-cafe_23-2148884499.jpg?w=740", 1, 10)
const product2 = new Product("Café Brasilero", "Intensidad media", 1000, "https://img.freepik.com/psd-premium/bolsa-papel-maqueta-cafe_23-2148884499.jpg?w=740", 2, 10)
const product3 = new Product("Café Italiano", "Intensidad fuerte", 1500, "https://img.freepik.com/psd-premium/bolsa-papel-maqueta-cafe_23-2148884499.jpg?w=740", 3, 10)
const product4 = new Product("Cafetera Italiana", "Hecha en aluminio. Pocillos: 9", 10000, "https://img.freepik.com/photos-premium/cafetera-moka-italiana-tradicional_739547-48.jpg?w=740", 4, 10)
const product5 = new Product("Cafetera Francesa", "Hecha en vidrio. Pocillos: 9", 6000, "https://img.freepik.com/photos-premium/cafetera-prensa-francesa-sobre-mesa-madera_52253-3241.jpg?w=740", 5, 10)
const product6 = new Product("Taza", "Hecha en cerámica", 2000, "https://img.freepik.com/photo-gratis/taza-cafe-patron-corazon-taza-blanca-sobre-fondo-madera-vintage-tono_1258-250.jpg?w=740&t=st=1675384318~exp=1675384918~hmac=61fa93b2fedbdf2e3e22406215c2d19ee3c306684ae21b4cd38aeea587c622a6", 6, 10)
const product7 = new Product("Pozillo", "Hecho en cerámica", 1200, "https://img.freepik.com/photo-gratis/taza-cafe_74190-2687.jpg?w=740&t=st=1675384164~exp=1675384764~hmac=54dbc88654ec2d5decca99058a299c7c4bf84ea698ca37be7c92ba2e0b5aeec0", 7, 10)
const product8 = new Product("Filtro", "De papel", 1000, "https://img.freepik.com/photo-gratis/alto-angulo-cafe-filtro_23-2148523007.jpg?w=740&t=st=1675384369~exp=1675384969~hmac=5fc8a13b41463f42b8bf1bd0f231e475a5f4bcbad337274fc00aa46b7af11b3b", 8, 10)
const product9 = new Product("Molinillo", "Con manija giratoria. Hecho en acrílico y acero inoxidable", 8000, "https://img.freepik.com/photo-gratis/granos-cafe-tazon-molinillo-cafe_23-2147711002.jpg?w=740&t=st=1675384446~exp=1675385046~hmac=dc160716b950665f92fd6202850f38d6bd2edcd85dfabb099a936b06f13342b3", 9, 10)
const product10 = new Product("Espumador", "A pila", 4000, "https://d3ugyf2ht6aenh.cloudfront.net/stores/001/180/130/products/whatsapp-image-2022-06-22-at-4-27-38-pm-11-d5790e6dc54be58ea316559355459674-640-0.jpeg", 10, 10)

await productManager.addProduct(product1, product1.code);
await productManager.addProduct(product2, product2.code);
await productManager.addProduct(product3, product3.code);
await productManager.addProduct(product4, product4.code);
await productManager.addProduct(product5, product5.code);
await productManager.addProduct(product6, product6.code);
await productManager.addProduct(product7, product7.code);
await productManager.addProduct(product8, product8.code);
await productManager.addProduct(product9, product9.code);
await productManager.addProduct(product10, product10.code);

//Consulta de productos
app.get("/products", async (req, res, next) => {
    try {
        const { limit } = req.query
        const products = await productManager.getProducts()
        if (limit) {
            res.send(JSON.stringify(products.slice(0, limit)))
        } else {
            res.send(JSON.stringify(products))
        }
    }
    catch (error) {
        next(error)
    }
})


//Consulta de productos por id
app.get("/products/:id", async (req, res) => {
    const product = await productManager.getProductById(req.params.id)
    res.send(product)
})


app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})
