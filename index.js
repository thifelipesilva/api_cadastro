require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const routes = require('./routes');

const app = express();
routes(app);


const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose
    .connect(`mongodb+srv://${dbUser}:${dbPassword}@apicluster.sxsb9.mongodb.net/apiDatabase?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(3000, () => console.log('Api rodando.'));
        console.log('Banco Conectado');
    })
    .catch(err => console.log(err));


    