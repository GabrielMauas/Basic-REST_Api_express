const express = require('express');
const config = require('config');
const morgan = require('morgan');

const users = require('./routes/users');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api/users', users);


// Configuración de entornos
console.log(`Aplcacion: ${config.get('name')}`);
console.log(`DB Server: ${config.get('configDB.host')}`);

// Middleware de terceros - Morgan
if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
}


app.get('/', (req, res) => {
    res.send('Hola mundo desde Express.');
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});


