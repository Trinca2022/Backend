const socket = io()

//MAIN DEL CART

//Obtengo elementos del DOM por el ID
const userName = document.getElementById("userName")
const idCart = document.getElementById("idCart")
const mostrarProds = document.getElementById("mostrarProds")

//Recibo el nombre y el rol del usuario logueado y los renderizo
//Usuario de mongo
socket.on("userName", userDatos => {
    userName.innerHTML = `
        <h1>${userDatos.rol} ${userDatos.nombre}</h1>
        <hr>
        `;
});

/*socket.on("cartInfo", ({ cart, prodsInCart }) => {
    idCart.innerHTML = `
                <h1>ID del carrito: ${cart._id}</h1>
                <hr>
                `;
});*/

mostrarProds.addEventListener('click', () => {
    socket.emit("getCart", undefined, ({ cart, prodsInCart }) => {
        idCart.innerHTML = `
                <h1>ID del carrito: ${cart._id}</h1>
                <hr>
                `;
        productList.innerHTML = ""
        //PARA CADA PRODUCTO EN EL CARRITO BUSCAR LA INFO DEL PRODUCTO EN PRODS IN CART USANDO EL ID DEL PROD EN EL CARRITO
        products.forEach(prod => {
            productList.innerHTML += `<div class="card" style="width: 15rem; display: inline-block; margin-right: 10px; margin-bottom: 10px;vertical-align: top; border: 1px solid #ccc; text-align: center;">
                    <h3 class="card-title">${prod.title}</h3>
                    <img style="width: 10rem; height: 10rem; object-fit: cover;" src="${prod.thumbnail}"
                    class="card-img-top" alt="...">
                    <div class="card-body">
                    <p class="card-text">Código: ${prod.code}.<br>
                        Stock: ${prod.stock}.<br>
                        Descripción: ${prod.description}.<br>
                        El precio es $${prod.price} </p>
                        <button onClick="eliminarProducto('${prod._id}')">Eliminar producto</button>
                        </div>
                        </div>`

        })
    })
    console.log("holaaaa front")
})

/*socket.on("connect", () => {
    socket.emit("getCart", undefined, ({ cart, prodsInCart }) => {
        idCart.innerHTML = `
                <h1>ID del carrito: ${cart._id}</h1>
                <hr>
                `;
    })
    console.log("holaaaa front")
})*/



