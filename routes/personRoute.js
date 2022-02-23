const { Router } = require('express');
const PersonController = require('../controllers/PersonController');

const router = Router();

router
    .get('/people', PersonController.getPeople)
    .get('/person/:id', PersonController.getPerson)
    .patch('/person/:id', PersonController.updatePerson)
    .delete('/person/:id', PersonController.deletePerson)

     
module.exports = router;
