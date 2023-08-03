import { Router } from 'express'
import { generateProductFaker } from './utilsFaker.js'

const getProductFaker = Router()

getProductFaker.get('/', async (req, res) => {
    try {
        const productsFaker = []
        console.log(productsFaker)

        for (let i = 0; i < 100; i++) {
            const prod = await generateProductFaker()
            productsFaker.push(prod)

        }


        res.json({ status: 'success', payload: productsFaker })
    }
    catch (error) { console.error("Error creating product:", error); }
})




export default getProductFaker
