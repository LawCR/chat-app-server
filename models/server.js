// Servidor de Express
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const path = require('path');
const cors = require('cors')
const Sockets = require('./sockets');
const { dbConnection } = require('../database/config');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        // Conectar a DB
        dbConnection()

        // HTTP SERVER
        this.server = http.createServer(this.app);

        // Configuración del socket server
        this.io = socketio(this.server, {/* configuraciones */});
    }

    middlewares() {
        // Desplegar el directorio público
        this.app.use( express.static( path.resolve( __dirname, '../public') ))

        // CORS
        this.app.use( cors() )

        // Parseo del body
        this.app.use( express.json() )

        // API Endpoints
        this.app.use('/api/auth', require('../router/auth'))
        this.app.use('/api/messages', require('../router/messages'))
    }

    configureSockets() {
        new Sockets( this.io )
    }

    execute() {
        // Inicializar Middlewares
        this.middlewares()

        // Inicializar Sockets
        this.configureSockets()

        // Inicializar Server
        this.server.listen(this.port, () => {
            console.log('Server corriendo en el puerto:', this.port)
        });
    }
}

module.exports = Server