import express from 'express'

import productRouter from './routes/product.routes.js'
import cartRouter from './routes/cart.routes.js'
import { __dirname } from './path.js'

//Configuro express
const app = express()
const PORT = 4000
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Rutas
app.use('/product', productRouter)
app.use('/cart', cartRouter)
app.use('/static', express.static(__dirname + '/public'))



app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})


