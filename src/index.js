import express from 'express'
import multer from 'multer'
import productRouter from './routes/product.routes.js'
import cartRouter from './routes/cart.routes.js'
import { __dirname, __filename } from './path.js'
import { engine } from 'express-handlebars'
import * as path from 'path'

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
app.engine('handlebars', engine())//Para trabajar con handlebars
app.set('view engine', 'handlebars')//Vistas de handlebars
app.set('views', path.resolve(__dirname, './views'))//Ubicación de las vistas

//Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const upload = (multer({ storage: storage }))



//Rutas
app.use('/product', productRouter)
app.use('/cart', cartRouter)
app.use('/', express.static(__dirname + '/public'))//La carpeta pública está en static pero después la defino en la ruta ppal
app.post('/upload', upload.single('product'), (req, res) => {
    res.send("Imagen subida")
})

//HBS

app.get('/', (req, res) => {
    const tutor = {
        nombre: "Luciana",
        email: "lu@lu.com",
        rol: "Tutor"
    }

    const cursos = [
        { numero: 123, nombre: "Programacion Backend", dia: "LyM", horario: "Noche" },
        { numero: 456, nombre: "React", dia: "S", horario: "Mañana" },
        { numero: 789, nombre: "Angular", dia: "MyJ", horario: "Tarde" }
    ]

    res.render('home', {//Primer parametro indico la vista a utilizar
        title: "51225 Backend",
        mensaje: "Hola, buenos dias",
        user: tutor,
        isTutor: tutor.rol === "Tutor", //V o F
        cursos: cursos
    })
})


app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})


