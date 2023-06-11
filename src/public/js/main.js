const socket = io()

//Obtengo elementos del DOM por el ID
const productForm = document.getElementById("productForm")
const productList = document.getElementById("productList")
const userName = document.getElementById("userName")

//Cuando se escucha el evento envío información de los prods al servidor
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

//Recibo los prods guardados en el servidor y los renderizo
socket.on("allProducts", products => {
    productList.innerHTML = ""
    products.forEach(prod => {
        productList.innerHTML += `
        <div>
        <p>${prod.title}</p>
        <p>${prod.description}</p>
        <p>${prod.price}</p>
        <p>${prod.thumbnail}</p>
        <p>${prod.code}</p>
        <p>${prod.stock}</p>
        <hr>
        </div>`
    })
})

//Recibo el nombre y el rol del usuario logueado y los renderizo
//Usuario de mongo
socket.on("userName", userDatos => {
    userName.innerHTML = `
        <h1>Bienvenido/a ${userDatos.rol} ${userDatos.nombre} </h1>
        <hr>
        `;
});
//Admin Coder
socket.on("userCoder", userDatosCoder => {
    userName.innerHTML = `
        <h1>Bienvenido/a ${userDatosCoder.rol} ${userDatosCoder.nombre} </h1>
        <hr>
        `;
});


