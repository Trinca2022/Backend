//acá va bcrypt
import bcrypt from 'bcrypt'

//Bcrypt para Hashear Password
export const hashData = async (data) => {
    return bcrypt.hash(data, 10)
}

export const compareData = async (data, hashData) => {
    return bcrypt.compare(data, hashData)
}