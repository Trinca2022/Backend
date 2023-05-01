const socket = io()

const productForm = document.getElementById("productForm")

productForm.addEventListener('submit', (e) => {
    e.preventDefault()
    //Transformo un objeto HTML a un objeto Iterator
    const prodsIterator = new FormData(e.target)
    //Transformo de un objeto Iterator a un objeto Simple
    const prod = Object.fromEntries(prodsIterator)
    socket.emit("newProduct", { prod })
})
