const { Router } = require('express');
const LoginController = require('../controllers/LoginController');
const checktoken = require('../service/checkToken');
const router = Router();

router

    //register person
    .post('/person/auth/register', LoginController.register)

    //login
    .post('/person/login', LoginController.login)
        
    //private route
    .get('/person/private/:id', checktoken, LoginController.getPerson)

   
module.exports = router;
