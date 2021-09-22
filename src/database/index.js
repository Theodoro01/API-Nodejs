//criando conexão com o banco de dados
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/noderest');
mongoose.Promise = global.Promise;

module.exports = mongoose;