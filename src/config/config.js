/*import dotenv from 'dotenv'
import program from '../utils/commander.js'
import * as path from 'path'
import { __dirname, __filename } from '../path.js';


dotenv.config({
    path: program.opts().mode === 'production' ? '.env.production' : '.env'
})




export default {
    URL_MONGODB_ATLAS: process.env.URL_MONGODB_ATLAS,
    SESSION_SECRET: process.env.SESSION_SECRET,
    PORT: process.env.PORT,
    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD

}*/

import dotenv from 'dotenv';
import program from '../utils/commander.js';
import path from 'path'; // Importar el módulo path
import { __dirname } from '../path.js';

const mode = program.opts().mode;

if (mode === 'production') {
    dotenv.config({ path: '.env.production' });
} else if (mode === 'test') {
    dotenv.config({ path: '.env.test' });
} else {
    dotenv.config({ path: '.env' });
}

export default {
    URL_MONGODB_ATLAS: process.env.URL_MONGODB_ATLAS,
    SESSION_SECRET: process.env.SESSION_SECRET,
    PORT: process.env.PORT,
    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD
}