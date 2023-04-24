import express from 'express'

import productRouter from './routes/product.routes.js'
import cartRouter from './routes/cart.routes.js'

//Configuro express
const app = express()
const PORT = 4000
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Rutas
app.use('/product', productRouter)
app.use('/cart', cartRouter)

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})


