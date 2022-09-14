// Servidor de Express
const express = require('express')
const app = express();

// Servidor de sockets
const server = require('http').createServer(app);

// Confirguración del socket server
const io = require('socket.io')(server);

// Desplegar el directorio público
app.use( express.static(__dirname + '/public'))

// socket seria como la referencia al cliente conectado
io.on('connection', ( socket ) => { 
    // Emit => Emitir eventos y se recibiran por el socket del lado del cliente - Argumentos: (evento, payload)

    // On => Escuchar un evento que viene del cliente, (evento, callback)
    socket.on('mensaje-to-server', (data) => {
        console.log(data)

        // IO: Para todos los clientes conectados
        io.emit('mensaje-from-server', data)
    })
});

server.listen(8081, () => {
    console.log('Server corriendo en el puerto :8081')
});