const express = require('express');
const bcrypt = require('bcrypt-nodejs')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const home = require('./controllers/home');
const image = require('./controllers/image');


const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: '1234',
        database: 'appdb'
    }
});

app.use(cors());

app.use(bodyParser.json());

app.get('/', (req, res) =>{
   home.handleHome(req, res, db);
});

app.get('/profile/:id', (req, res) =>{
   profile.handleProfile(req, res, db);
});

app.put('/image', (req, res)=>{
    image.handleImage(req, res, db);

});

app.post('/signin', (req, res) =>{
    signin.handleSignIn(req, res, db, bcrypt);

});

app.post('/register', (req, res)=>{
    register.handleRegister(req,res, db, bcrypt)
});

app.listen(3000, ()=>{
    console.log("App is running on port 3000")
})
