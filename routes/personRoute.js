const router = require('express').Router();
const Person = require('../models/Person');

router
    .get('/persons', async (req, res) => {
        try {
            const persons = await Person.find();
            res.status(200).json(persons)
        } catch (error) {
            res.status(500).json(error);
        }
    })

    .get('/person/:id', async (req, res) => {
        const id = req.params.id;
        try {
            const person = await Person.findOne({ _id: id });
            res.status(200).json(person);
        } catch (error) {
            res.status(500).json(error);
        }
    })

    .post('/person', async (req, res) => {
        const { name, email, phone, password } = req.body;
        const datePerson = { name, email, phone, password };
        try {
            const person = await Person.create(datePerson);
            res.status(201).json(person);
        } catch (error) {
            res.status(500).json(error);
        }

    })

    .patch('/person/:id', async (req, res) => {
        const id = req.params.id;
        const datePerson = req.body;        

        try {
            await Person.updateOne({ _id: id }, datePerson);
            const person = await Person.findOne({ _id: id })
            res.status(200).json(person);
        } catch (error) {
            res.status(500).json(error);
        }
    })

    .delete('/person/:id', async (req, res) => {
        const id = req.params.id;
        try {
            await Person.deleteOne({ _id: id });
            res.status(200).json({ menssage: `O ${id} foi deletado`});
        } catch (error) {
            res.status(500).json(error);
        }
    })

module.exports = router;
