import dotenv from 'dotenv'
import program from './utils/commander.js'

dotenv.config({
    path: program.opts().mode === 'production' ? '.env.production' : '.env'
})

export default {
    URL_MONGODB_ATLAS: process.env.URL_MONGODB_ATLAS,
    SESSION_SECRET: process.env.SESSION_SECRET,
    PORT: process.env.PORT
}