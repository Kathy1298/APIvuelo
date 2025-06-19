//CONFIGURAICON A BASE DE DATOS

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { body, validationResult } = require('express-validator');

app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use(express.json());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CONFIGURACION DE LA BASE DE DATOS

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1298',
  database: 'reservas_vuelos'
});
db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos');
  }
});

//INICIALLIZA EL SERVIDOR Y PUERTO

const PORT = 3007; 
app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
});

//▪ Listar todas las profesional (GET)
app.get('/reservas', (req, res) => {
    db.query('SELECT * FROM reservas', (err, results) => {
        if (err) throw err;
        res.json(results);
    }); 
});

//Listar todos los categorias (GET)
app.get('/categoria', (req, res) => {
    db.query('SELECT * FROM categoria', (err, results) => {
        if (err) throw err;
        res.json(results);
    }); 
});

// Registrar un nuevo profesional (POST)

app.post('/profesional', (req, res) => {
  const {
    nombres, apellidos, titulo, email, telefono,
      ubicacion, descripcion, portafolio_url
  } = req.body;

  const sql = `
    INSERT INTO registro_cliente_vehiculo (
      nombres, apellidos, titulo, email, telefono,
      ubicacion, descripcion, portafolio_url
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    nombres, apellidos, titulo, email, telefono,
      ubicacion, descripcion, portafolio_url
  ];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error al insertar datos:', err);
      return res.status(500).json({ error: 'Error al insertar datos' });
    }

    res.json({
      id: results.insertId,
      nombres, apellidos, titulo, email, telefono,
      ubicacion, descripcion, portafolio_url
    });
  });
});


// GET  por ID
app.get('/profesional/:categoria_id', (req, res) => {
    const { id } = req.params;
    
    db.query('SELECT * FROM profesional WHERE id = ?', [categoria_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al obtener proveedor' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }
        res.json(results[0]);
    });
});
