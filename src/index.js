import express from 'express'
import multer from 'multer'
import productRouter from './routes/product.routes.js'
import cartRouter from './routes/cart.routes.js'
import { __dirname } from './path.js'

//Configuro express
const app = express()
const PORT = 4000
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img')
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`)
    }
})

//Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const upload = (multer({ storage: storage }))


//Rutas
app.use('/product', productRouter)
app.use('/cart', cartRouter)
app.use('/static', express.static(__dirname + '/public'))
app.post('/upload', upload.single('product'), (req, res) => {

    res.send("Imagen subida")

})

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})


