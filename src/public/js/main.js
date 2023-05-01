//console.log("Hola, esto anda")

const socket = io()

socket.emit("mensaje", "Hola, feliz día")