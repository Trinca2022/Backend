const socket = io()

//MAIN DE LA VISTA DE PRODUCTOS PARA ADMIN/PREMIUM

//Obtengo elementos del DOM por el ID
const productForm = document.getElementById("productForm")
const productList = document.getElementById("productList")
const adminName = document.getElementById("adminName")


// Obtener el elemento del DOM donde deseas mostrar la información del usuario
const userContainer = document.getElementById("adminOrPremiumEmail");

// Obtener el contenido del div con el correo del usuario
const userEmail = userContainer.textContent;


//Envío evento al back para manejarlo
const addProdInCart = (productId) => {
    socket.emit("addProductCart", { _id: productId }, userEmail)
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
    }, userEmail)

})

//Función del Administrador para eliminar un producto
const eliminarProducto = (productId) => {
    socket.emit("deletedProduct", { _id: productId }, userEmail)
}

//Recibo los prods guardados en el servidor y los renderizo
socket.on("allProducts", products => {
    productList.innerHTML = ""
    products.forEach(prod => {
        productList.innerHTML += `
            <div class="card" style="width: 15rem; display: inline-block; margin-right: 10px; margin-bottom: 10px; vertical-align: top; border: 1px solid #ccc; text-align: center;">
                <h3 class="card-title">${prod.title}</h3>
                ${prod.thumbnail && esURL(prod.thumbnail) ? `<img style="width: 10rem; height: 10rem; object-fit: cover;" src="${prod.thumbnail}" class="card-img-top" alt="...">` : ''}
                
                <div class="card-body">
                    <p class="card-text">Propietario/a: ${prod.owner}.<br>Código: ${prod.code}.<br>
                        Stock: ${prod.stock}.<br>
                        Descripción: ${prod.description}.<br>
                        El precio es $${prod.price} </p>
                    <button onClick="eliminarProducto('${prod._id}')">Eliminar producto</button>
                    <button onClick="addProdInCart('${prod._id}')">Agregar al carrito</button>
                </div>
            </div>`
    });

})

socket.on("prodInCart", (message) => {
    alert(message)
});

//Emito en el front error de eliminación
socket.on("productNotDeleted", (message) => {
    alert(message);
});

//Emito en el front error de eliminación
socket.on("productNotBuyed", (message) => {
    alert(message);
});

//Envío evento al back para manejarlo
const goToUsuario = () => {
    socket.emit("goToUsuario", userEmail)
}


//Redirecciono a productos de USER
socket.on("redirectToUserProds", (path) => {
    alert("Iniciá sesión nuevamente")
    setTimeout(() => {
        // Redirige a la página especificada
        window.location.href = path;
    }, 1000);

});

function esURL(url) {
    // Expresión regular para validar URLs
    const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return regex.test(url);
}

