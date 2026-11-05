// Reutiliza a API compilada, sem iniciar um servidor persistente.
const { app } = require('../backend/dist/backend/src/app.js')
module.exports = app
