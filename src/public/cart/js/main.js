const socket = io()

//MAIN DEL CART

//Obtengo elementos del DOM por el ID
const userName = document.getElementById("userName")
const idCart = document.getElementById("idCart")

//Recibo el nombre y el rol del usuario logueado y los renderizo
//Usuario de mongo
socket.on("userName", userDatos => {
    userName.innerHTML = `
        <h1>${userDatos.rol} ${userDatos.nombre}</h1>
        <hr>
        `;
});

socket.on("idCart", userDatos => {
    idCart.innerHTML = `
                <h1>ID del carrito: ${userDatos.id_cart}</h1>
                <hr>
                `;
});