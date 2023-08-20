const socket = io()

//MAIN DE LA VISTA DE PRODUCTOS PARA ADMIN/PREMIUM

//Obtengo elementos del DOM por el ID
const productForm = document.getElementById("productForm")
const productList = document.getElementById("productList")
const adminName = document.getElementById("adminName")

const addProdInCart = (productId) => {
    socket.emit("addProduct", { _id: productId })
}


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

//Función del Administrador para eliminar un producto
const eliminarProducto = (productId) => {
    socket.emit("deletedProduct", { _id: productId })
}
//Recibo los prods guardados en el servidor y los renderizo
socket.on("allProducts", products => {
    productList.innerHTML = ""
    products.forEach(prod => {
        productList.innerHTML += `<div class="card" style="width: 15rem; display: inline-block; margin-right: 10px; margin-bottom: 10px;vertical-align: top; border: 1px solid #ccc; text-align: center;">
        <h3 class="card-title">${prod.title}</h3>
        <img style="width: 10rem; height: 10rem; object-fit: cover;" src="${prod.thumbnail}"
        class="card-img-top" alt="...">
        <div class="card-body">
        <p class="card-text">Propietario/a: ${prod.owner}.<br>Código: ${prod.code}.<br>
            Stock: ${prod.stock}.<br>
            Descripción: ${prod.description}.<br>
            El precio es $${prod.price} </p>
            <button onClick="eliminarProducto('${prod._id}')">Eliminar producto</button>
            <button onClick="addProdInCart('${prod._id}')">Comprar producto</button>
            </div>
            </div>`

    })
})

/*//Cuando se escucha el evento envío información del prod a actualizar al servidor
const actualizarProducto = document.getElementById(`actualizarProducto-${prod._id}`)
actualizarProducto.addEventListener('click', (e) => {
    e.preventDefault()
    //Transformo un objeto HTML a un objeto Iterator
    const prodsIterator = new FormData(e.target)
    //Transformo de un objeto Iterator a un objeto Simple
    const prod = Object.fromEntries(prodsIterator)
    socket.emit("updatedProduct", {
        title: prod.title,
        description: prod.description,
        price: prod.price,
        thumbnail: prod.thumbnail,
        code: prod.code,
        stock: prod.stock
    })
})*/




//Recibo el nombre y el rol del usuario logueado y los renderizo
//Usuario de mongo
socket.on("adminName", userDatos => {
    adminName.innerHTML = `
    <h1>Bienvenido/a ${userDatos.rol} ${userDatos.nombre} </h1>
        <hr>
        `;
});

//Emito error de eliminación
socket.on("productNotDeleted", (message) => {
    alert(message);
});

//Emito error de eliminación
socket.on("productNotBuyed", (message) => {
    alert(message);
});





