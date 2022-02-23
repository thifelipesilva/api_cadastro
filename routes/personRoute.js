require('dotenv').config();
const router = require('express').Router();
const Person = require('../models/Person');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router
    .get('/people', async (req, res) => {
        try {
            const people = await Person.find();
            return res.status(200).json(people)
        } catch (error) {
            return res.status(500).json(error);
        }
    })

    .get('/person/:id', async (req, res) => {
        const id = req.params.id;
        try {
            const person = await Person.findOne({ _id: id });
            return res.status(200).json(person);
        } catch (error) {
            return res.status(500).json(error);
        }
    })   

    .patch('/person/:id', async (req, res) => {
        const id = req.params.id;
        const datePerson = req.body;        

        try {
            await Person.updateOne({ _id: id }, datePerson);
            const person = await Person.findOne({ _id: id })
            return res.status(200).json(person);
        } catch (error) {
            return res.status(500).json(error);
        }
    })

    .delete('/person/:id', async (req, res) => {
        const id = req.params.id;
        try {
            await Person.deleteOne({ _id: id });
            return res.status(200).json({ menssage: `O ${id} foi deletado`});
        } catch (error) {
            return res.status(500).json(error);
        }
    })

     //register person
    .post('/person/auth/register', async (req, res) => {
        
        const { name, email, phone, password, confirmPassword } = req.body;       

        //validation
        if(!name) {
            return res.status(422).json({ msg: 'nome é obrigatorio'});
        }
        if(!email) {
            return res.status(422).json({ msg: 'email é obrigatorio'});
        }
        if(!phone) {
            return res.status(422).json({ msg: 'phone é obrigatorio'});
        }

        //password validation
        if(!password) {
            return res.status(422).json({ msg: 'senha é obrigatorio'});
        } else if (password !== confirmPassword) {
            return res.status(422).json({ msg: 'senhas não são iguais'});
        }

        //check if user exists
        const userExists = await Person.findOne({ email: email });
        if(userExists) {
            return res.status(422).json({ msg: 'email ja foi cadastrado'});
        }
        
        //create password

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);
        
        //create person
        const datePerson = { name, email, phone, password: passwordHash };

        try {
            const person = await Person.create(datePerson);
            return res.status(201).json(person);
        } catch (error) {
            return res.status(500).json({ msg: error });
        }

    })

    //login
    .post('/person/login', async (req, res) => {
        const { email, password } = req.body;

        //validation
        if(!email) {
            return res.status(422).json({ msg: 'email é obrigatorio'});
        } else if(!password) {
            return res.status(422).json({ msg: 'password é obrigatorio'});
        }

        //check if person exist
        const person = await Person.findOne({ email: email});
        if(!person) {
            return res.status(404).json({ msg: 'Email não cadastrado'});
        }

        //check if password is match
        const checkPass = await bcrypt.compare(password, person.password);
        if(!checkPass) {
            return res.status(422).json({ msg: 'Password is not match' });
        }


        try {
            const secret = process.env.SECRET;
            const token = jwt.sign({ id: person._id }, secret);

            return res.status(200).json({ msg: 'Logado', token });
        } catch (error) {
            return res.status(422).json({ msg: 'não logado' });
        }     


    })

    //private route
    .get('/person/private/:id', checktoken, async (req, res) => {
        const id = req.params.id;

        try {
            const person = await Person.findById({ _id: id });
            res.status(200).json(person);
        } catch (error) {
            
            res.status(500).json({ msg: 'usuario não existe '});
        }
    });

    function checktoken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(!token) {
            return res.status(401).json({ msg: 'acesso negado' });
        }

        try {
            const secret = process.env.SECRET;
            jwt.verify(token, secret);

            next();
            
        } catch (error) {
            res.status(400).json({ msg: 'Token invalid' });
        }
    }

module.exports = router;
