const { userConnected, userDisconnected, getUsers, saveMessage } = require("../controllers/sockets");
const { verifyJWT } = require("../helpers/jwt");

class Sockets {

    constructor( io ) {
        this.io = io

        this.socketEvents()
    }

    socketEvents() {
        // On connection
        this.io.on('connection', async( socket ) => { 
            // Emit => Emitir eventos y se recibiran por el socket del lado del cliente - Argumentos: (evento, payload)
            // On => Escuchar un evento que viene del cliente, (evento, callback)
            // socket: Para el cliente que realiza el evento (socket.emit)
            // io: Para todos los clientes conectados (this.io.emit)
            // broadcast: Para todos los clientes conectados menos el que realiza el evento (socket.broadcast.emit)
            // socket.handshake.query para recibir los parametros que vienen en el token
            
            //* Validar el JWT y si el token no es valido, desconectar
            const [isValid, uid] = verifyJWT(socket.handshake.query['x-token'])

            if (!isValid) {
                console.log('Socket no identificado')
                return socket.disconnect()
            }

            //* Unir al usuario que se conecta correctamente a una sala de socket.io (que sera la forma de mandarle mensajes a ese usuario mediante su sala identificado por su uid 
            socket.join(uid)

            //* Marcar al usuario como conectado en la bd mediante el UID
            await userConnected(uid)

            //* Emitir todos los usuarios conectados
            // Ponerle a todo cambio a la lista de usuarios como agregar, editar, etc
            this.io.emit('users_list', await getUsers())

            // TODO: Socket join, uid

            //* Escuchar cuando el cliente manda un mensaje
            socket.on('personal_message', async(payload) => {
                const message = await saveMessage(payload)
                this.io.to(payload.from).emit('personal_message', message)
                this.io.to(payload.to).emit('personal_message', message)
            })
            
            // TODO: Emitir todos los usuarios conectados

            //* Marcar al usuario como desconectado en la bd mediante el UID
            socket.on('disconnect', async() => {
                await userDisconnected(uid)
                this.io.emit('users_list', await getUsers())
            })
        });
    }

}

module.exports = Sockets