const socket = io()

//MAIN DEL CART

//Obtengo elementos del DOM por el ID
const userName = document.getElementById("userName")
const idCart = document.getElementById("idCart")
const showProdsInCart = document.getElementById("prodsInCart")

//Envío evento al back para manejarlo
const goToProds = () => {
    socket.emit("goToProds")
}


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

socket.on("getProdsInCart", (prodsInCart, quantityByProductId) => {
    showProdsInCart.innerHTML = "";
    prodsInCart.forEach((prod) => {
        showProdsInCart.innerHTML += `
        <div class="card" style="width: 15rem; display: inline-block; margin-right: 10px; margin-bottom: 10px;vertical-align: top; border: 1px solid #ccc; text-align: center;">
        <h3 class="card-title">${prod.title}</h3>
        <img style="width: 10rem; height: 10rem; object-fit: cover;" src="${prod.thumbnail}" class="card-img-top" alt="...">
        <div class="card-body">
          <p class="card-text">
            Propietario/a: ${prod.owner}.<br>
            Código: ${prod.code}.<br>
            Stock: ${prod.stock}.<br>
            Descripción: ${prod.description}.<br>
            El precio es $${prod.price}<br>
            Cantidad en el carrito: ${quantityByProductId[prod._id] || 0} unidades
          </p>
        </div>
      </div>`;
    });
});


//Redirecciono a productos de usuario
socket.on("redirectToUserProds", (path) => {
    window.location.href = path;
});

//Redirecciono a productos de premium
socket.on("redirectToPremiumProds", (path) => {
    window.location.href = path;
});



