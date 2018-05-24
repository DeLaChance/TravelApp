const express = require('express')
const path = require('path')

const { config } = require('../../config/index')
const { catchErrors } = require('../../utils/errorHandlers')
const { tryFetchUserById, tryFetchUserDestinations, tryFetchUserDestinationById } = require('./routeHandlers')

const router = express.Router()
const httpServer = express()

httpServer.use(express.static(path.join(__dirname, '../../public')))

httpServer.get('/api/user/:userId/', tryFetchUserById);
httpServer.get('/api/user/:userId/destination', tryFetchUserDestinations);
httpServer.get('/api/user/:userId/destination/:destinationId', tryFetchUserDestinationById);

var port = config.httpServer.port;
var host = config.httpServer.host;

httpServer.listen(port, host, () => console.log("Http server listening on %s:%d", host, port))
