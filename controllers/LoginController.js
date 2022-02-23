require('dotenv').config();
const Person = require('../models/Person');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');




class LoginController {
    static async register(req, res) {

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
    }

    static async login(req, res) {
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

    }


    static async getPerson(req, res) {
        const id = req.params.id;

        try {
            const person = await Person.findById({ _id: id });
            res.status(200).json(person);
        } catch (error) {
            
            res.status(500).json({ msg: 'usuario não existe '});
        }
    }
}

module.exports = LoginController;