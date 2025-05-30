const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// Configuração CORRETA do CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://dev-web-react-front-express.vercel.app',
  'https://dev-web-react-front-express-*.vercel.app' // Permite todos os subdomínios de deploy preview
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permite requests sem origem (como mobile apps ou curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowedOrigin => 
      origin === allowedOrigin || 
      origin.endsWith('.vercel.app') ||
      origin.includes('localhost')
    )) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // Para navegadores legados
};

// Aplica o CORS para todas as rotas
app.use(cors(corsOptions));

// Pré-voo explícito para todas as rotas
app.options('*', cors(corsOptions));

app.use(express.json());
app.use('/api', routes);

// Rota de saúde melhorada
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'API funcionando',
    timestamp: new Date().toISOString(),
    cors: {
      allowedOrigins: allowedOrigins,
      methods: corsOptions.methods
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log('Origens permitidas:', allowedOrigins);
});