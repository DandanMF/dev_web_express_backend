const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração básica
app.use(cors());
app.use(express.json());
app.use('/api', routes);

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});