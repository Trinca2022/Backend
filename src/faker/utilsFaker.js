import { fakerES } from "@faker-js/faker";
import { productFakerModel } from "./productFakerSchema.js";

export const generateProductFaker = async () => {
    try {
        const productsFakerCreated = await productFakerModel.create({
            title: fakerES.commerce.productName(),
            description: fakerES.commerce.productDescription(),
            price: fakerES.commerce.price(),
            thumbnail: fakerES.image.urlPicsumPhotos(),
            stock: 15,
            //id: fakerES.database.mongodbObjectId(),
            status: true
        })
        return productsFakerCreated
    }
    catch (error) { console.error("Error creating product:", error); }

}