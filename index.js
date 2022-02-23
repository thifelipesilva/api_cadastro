require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const personRoute = require('./routes/personRoute');

const app = express();

app.use(express.json());
app.use(personRoute);

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose
    .connect(`mongodb+srv://${dbUser}:${dbPassword}@apicluster.sxsb9.mongodb.net/apiDatabase?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(3000, () => console.log('Api rodando.'));
        console.log('Banco Conectado');
    })
    .catch(err => console.log(err));


    