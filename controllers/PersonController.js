const Person = require('../models/Person');

class PersonController {

    static async getPeople(req, res) {
        
        try {
            const people = await Person.find();
            return res.status(200).json(people)
        } catch (error) {
            return res.status(500).json(error);
            
        }
    }

    static async getPerson(req, res) {
        const id = req.params.id;
        try {
            const person = await Person.findOne({ _id: id }, '-password');
            return res.status(200).json(person);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    }

    static async updatePerson(req, res) {
        const id = req.params.id;
        const datePerson = req.body;        

        try {
            await Person.updateOne({ _id: id }, datePerson);
            const person = await Person.findOne({ _id: id })
            return res.status(200).json(person);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    static async deletePerson(req, res) {
        const id = req.params.id;
        try {
            await Person.deleteOne({ _id: id });
            return res.status(200).json({ menssage: `O ${id} foi deletado`});
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}


module.exports = PersonController;