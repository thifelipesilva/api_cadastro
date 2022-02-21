const express = require('express');
const mongoose = require('mongoose');

const personRoute = require('./routes/personRoute');

const app = express();

app.use(express.json());
app.use(personRoute);



mongoose
    .connect('mongodb+srv://user:YLMdobizy2BhKhRl@apicluster.sxsb9.mongodb.net/apiDatabase?retryWrites=true&w=majority')
    .then(() => {
        app.listen(3000, () => console.log('Api rodando.'));
        console.log('Banco Conectado');
    })
    .catch(err => console.log(err));


