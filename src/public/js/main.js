const socket = io()

const productForm = document.getElementById("productForm")
const productList = document.getElementById("productList")

productForm.addEventListener('submit', (e) => {
    e.preventDefault()
    //Transformo un objeto HTML a un objeto Iterator
    const prodsIterator = new FormData(e.target)
    //Transformo de un objeto Iterator a un objeto Simple
    const prod = Object.fromEntries(prodsIterator)
    socket.emit("newProduct", {
        title: prod.title,
        description: prod.description,
        price: prod.price,
        thumbnail: prod.thumbnail,
        code: prod.code,
        stock: prod.stock

    })

})
socket.on("newProduct", productNew => {

    productList.innerHTML = ""

    productNew.forEach(prod => {
        productList.innerHTML += `
        <p>${prod.title}</p>
        <p>${prod.description}</p>
        <p>${prod.price}</p>
        <p>${prod.thumbnail}</p>
        <p>${prod.code}</p>
        <p>${prod.stock}</p>
        <hr>`
    })
    console.log('hola', productNew)

}) 