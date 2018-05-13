const express = require('express')
const path = require('path')

const { config } = require('../../config/index')
const { catchErrors } = require('../../utils/errorHandlers')

const router = express.Router()
const httpServer = express()

httpServer.use(express.static(path.join(__dirname, '../../public')))

var port = config.httpServer.port;
var host = config.httpServer.host;

httpServer.listen(port, host, () => console.log("Http server listening on %s:%d", host, port))
