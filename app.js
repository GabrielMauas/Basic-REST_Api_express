const express = require('express');
const config = require('config');
const Joi = require('joi');
const morgan = require('morgan');

const app = express();

// Middlewares para formatos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuración de entornos
console.log(`Aplcacion: ${config.get('name')}`);
console.log(`DB Server: ${config.get('configDB.host')}`);

// Middleware de terceros - Morgan
if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
}


// Hard data
const users = [
    {id: 1, name: 'Dan'},
    {id: 2, name: 'Gabriel'},
    {id: 3, name: 'Uriel'}
];

// Peticiones GET
app.get('/', (req, res) => {
    res.send('Hola mundo desde Express.');
});

app.get('/api/users', (req, res) => {
    res.send(users);
});

app.get('/api/users/:id', (req, res) => {
    // Encontrar si existe el objeto
    let user = userExist(req.params.id);
    if(!user){
        res.status(404).send('El usuario no fue encontrado');
        return;
    }

    res.send(user);
})

// Peticiones POST
app.post('/api/users', (req, res) => {

    const {error, value} = valUser(req.body.name);

    if(!error){
        const user = {
            id: users.length + 1,
            name: value.name
        }
        users.push(user);
        res.send(user);
    } else {
        const msg = error.details[0].message;
        res.status(400).send(msg); //400: Bad request
    }
});

// Peticiones PUT
app.put('/api/users/:id', (req, res) => {
    // Encontrar si existe el objeto
    let user = userExist(req.params.id);
    if(!user){
        res.status(404).send('El usuario no fue encontrado');
        return;
    } 
    const {error, value} = valUser(req.body.name);
    
    if(error) {
        const msg = error.details[0].message;
        res.status(400).send(msg); //400: Bad request
        return;
    }
    user.name = value.name;
    res.send(user);
});

// Peticiones Delete
app.delete('/api/users/:id', (req, res) => {
    // Encontrar si existe el objeto
    let user = userExist(req.params.id);
    if(!user){
        res.status(404).send('El usuario no fue encontrado');
        return;
    }

    const index = users.indexOf(user);
    users.splice(index, 1);

    res.send(user);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});

// Funciones para validar
const userExist = id => {
    return users.find(user => user.id === parseInt(id));
}

const valUser = n => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });
    return (schema.validate({ name: n }));
}

