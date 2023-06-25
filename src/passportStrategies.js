import passport from "passport";
import { userModel } from '../src/models/Users.js'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as GithubStrategy } from 'passport-github2'
import { compareData } from './utils.js'



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

// GITHUB - PASSPORT

passport.use(
    'githubSignup',
    new GithubStrategy(
        {
            clientID: 'Iv1.49c9130aa401f63e',
            clientSecret: 'dc6c82135271902bfbe0dfac5a0db595e31bac55',
            callbackURL: 'http://localhost:8080/api/users/github',
        },
        async (accessToken, refreshToken, profile, done) => {
            const { name, email } = profile._json
            try {
                const userDB = await userModel.findOne({ email })
                if (userDB) {
                    return done(null, userDB)
                }
                const user = {
                    first_name: name.split(' ')[0],
                    last_name: name.split(' ')[1] || '',
                    email,
                    password: ' ',
                }
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