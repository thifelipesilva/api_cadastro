const bodyParser = require('body-parser');

const personRoute = require('./personRoute');
const loginRoute = require('./loginRoute');

module.exports = app => {

    app.use(bodyParser.json());

    app.use(personRoute);
    app.use(loginRoute);
} 