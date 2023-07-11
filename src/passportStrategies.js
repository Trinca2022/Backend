import passport from "passport";
import { userModel } from './persistencia/models/Users.js'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as GithubStrategy } from 'passport-github2'
import { compareData } from './utils/bcrypt.js'
import { cartModel } from "./persistencia/models/Cart.js";



// Estrategia Passport-local
passport.use('login',
    new LocalStrategy(
        {
            usernameField: 'email',
            passReqToCallback: true,
        },
        async (req, email, password, done) => {
            try {
                const user = await userModel.findOne({ email })

                if (!user) {
                    return done(null, false)
                }
                const isPasswordValid = await compareData(password, user.password)
                if (!isPasswordValid) {
                    return done(null, false)
                }
                done(null, user)
            } catch (error) {
                done(error)
            }
        }
    )
)

// Estrategia Passport-Github
passport.use(
    'githubRegister',
    new GithubStrategy(
        {
            clientID: 'Iv1.863d8d4eacf90fe8',
            clientSecret: '85322465a58c1e30eba3a569721b3642763c8ece',
            callbackURL: 'http://localhost:4000/sessions/github',
        },
        async (req, accessToken, refreshToken, profile, done) => {
            const { name, email } = profile._json
            try {
                const userDB = await userModel.findOne({ email })

                if (userDB) {
                    return done(null, userDB)
                }
                const user = {
                    nombre: name.split(' ')[0],
                    apellido: name.split(' ')[1] || '',
                    email,
                    password: '',
                    id_cart: ''
                }
                //Genero carrito
                const cart = await cartModel.create({ product: [] })
                //id_cart del usuario es igual al id del carrito que se crea
                user.id_cart = cart._id
                const newUserDB = await userModel.create(user)
                done(null, newUserDB)
            } catch (error) {
                done(error)
            }
        }
    )
)

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id)
        done(null, user)
    } catch (error) {
        done(error)
    }
})