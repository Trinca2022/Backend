const socket = io()

//Obtengo elementos del DOM por el ID
const chatForm = document.getElementById("chatForm")
const chatList = document.getElementById("chatList")


//Cuando se escucha el evento envío información de los mensajes al servidor
chatForm.addEventListener('submit', (a) => {
    a.preventDefault()
    //Transformo un objeto HTML a un objeto Iterator
    const chatsIterator = new FormData(a.target)
    //Transformo de un objeto Iterator a un objeto Simple
    const chat = Object.fromEntries(chatsIterator)
    socket.emit("newChat", {
        mail: chat.mail,
        message: chat.message,

    })


})

//Recibo los msjs guardados en el servidor y los renderizo
socket.on("allChats", chats => {
    chatList.innerHTML = ""
    chats.forEach(chat => {
        chatList.innerHTML += `
        <div>
        <p>${chat.mail}</p>
        <p>${chat.message}</p>
        <hr>
        </div>`
    })
}) 
