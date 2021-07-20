const express = require('express');
const Joi = require('joi');

const route = express.Router();

// Hard data
const users = [
    {id: 1, name: 'Dan'},
    {id: 2, name: 'Gabriel'},
    {id: 3, name: 'Uriel'}
];

// Peticiones GET
route.get('/', (req, res) => {
    res.send(users);
});

route.get('/:id', (req, res) => {
    // Encontrar si existe el objeto
    let user = userExist(req.params.id);
    if(!user){
        res.status(404).send('El usuario no fue encontrado');
        return;
    }

    res.send(user);
})

// Peticiones POST
route.post('/', (req, res) => {

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
route.put('/:id', (req, res) => {
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
route.delete('/:id', (req, res) => {
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

module.exports = route;