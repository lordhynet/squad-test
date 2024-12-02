const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors'); 
const v1Routes = require('./routes'); 

const app = express();

app.use(helmet());

app.use(express.json({ limit: '5mb' }));

app.use(xss());

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'], 
}));

app.use('/v1', v1Routes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: true,
        message: err.message || 'Internal Server Error',
    });
});

app.use((req, res) => {
    res.status(404).json({
        error: true,
        message: 'Endpoint not found',
    });
});

module.exports = app;
