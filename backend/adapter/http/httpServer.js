const express = require('express')
const path = require('path')

const { config } = require('../../config/index')
const {
  tryFetchUserById,
  tryFetchUserDestinations,
  tryFetchUserDestinationById,
  tryAddTravelDestination,
  tryDeleteUserDestinationById,
  errorHandler
  } = require('./routeHandlers')
const bodyParser = require('body-parser')

const router = express.Router()
const httpServer = express()

httpServer.use(express.static(path.join(__dirname, '../../public')))
httpServer.use(bodyParser.json())

httpServer.get('/api/user/:userId', errorHandler(tryFetchUserById));
httpServer.get('/api/user/:userId/destination', errorHandler(tryFetchUserDestinations));
httpServer.get('/api/user/:userId/destination/:destinationId', errorHandler(tryFetchUserDestinationById));
httpServer.post('/api/user/:userId/destination', errorHandler(tryAddTravelDestination));
httpServer.delete('/api/user/:userId/destination/:destinationId', errorHandler(tryDeleteUserDestinationById));

var port = config.httpServer.port;
var host = config.httpServer.host;

httpServer.listen(port, host, () => console.log("Http server listening on %s:%d", host, port))
