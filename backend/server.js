const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

// Configuration CORS - autorise les origines autorisées
const allowedOrigins = [
  'https://dmembre-toi.vercel.app',
  'https://dmembre-toi.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8001'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Origine bloquée par CORS:', origin);
      callback(null, true); // Accepte toutes pour le test
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors());

app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API DMEMBRE TOI', status: 'online' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// API Routes
app.use('/api/v1/products', require('./routes/products'));
app.use('/api/v1/orders', require('./routes/orders'));
app.use('/api/v1/upload', require('./routes/upload'));
app.use('/api/v1/auth', require('./routes/auth'));

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});