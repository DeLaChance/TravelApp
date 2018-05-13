var fs = require('fs')
const path = require('path')

var data = fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8')
var config = JSON.parse(data)
console.log("Loaded configuration: " + JSON.stringify(config))

module.exports.config = config
