import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import path from 'node:path';

import bodyParser from 'body-parser';
const { json } = bodyParser;

const app = express();
const PUERTO = Number(process.env.PORT)|| 3000;

// Middlewares
app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(json());

// Rutas
import router from './src/Routes/routes.js';

app.get('/', (req, res) => {
    res.send('Bienvenido a Spotify');
});

app.use('/api', router);


// Iniciar servidor
app.listen(PUERTO, () => {
    console.log(`Servidor iniciado en el puerto ${PUERTO}`);
});