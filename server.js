const express = require('express');
const bcrypt = require('bcrypt-nodejs')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const knex = require('knex');

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
/*const database = {
    users: [
        {
            id: '123',
            name: 'chomo',
            password: 'cookies',
            email: 'chomogwom@yahoo.com',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'emma',
            password: 'cookies',
            email: 'emmagwom@yahoo.com',
            entries: 0,
            joined: new Date()
        }

    ]
}*/

app.get('/', function(req, res){
    db.select('*').from('users')
        .then(data=>{
            if(data.length){


                /**/
                return res.json(data);
            }
            else
            {
                return res.status(400).json("There are no users");
            }

        })
        .catch(err=> res.status(400).json("Could not get users"));
})

app.get('/profile/:id', function(req, res){
    const {id} = req.params;

    db.select('*').from('users')
        .where({id:id})
        .then(user =>{
            if(user.length){
                 res.json(user[0]);
            }
            else{
                res.status(400).json('No such user');
            }
        }).catch(err=> console.log(err));


});

app.put('/image', (req, res)=>{
    const {id} = req.body;
    db('users').where('id', '=', id).increment ('entries', 1).returning('entries').then(entries=>{
            res.json(entries[0])
        }).catch(err=> res.status(400).json('Unable to get image count'));

});


app.post('/signin', (req, res) =>{
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data=>{
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if(isValid){
               return db.select('*').from ('users')
                    .where('email', '=', req.body.email)
                    .then(user=>{
                        res.json(user[0])
                    })
                    .catch(err=>{res.status(400).json(err + 'User not found')});
            }
            else{
                res.status(400).json('Wrong credentials');
            }
        })
        .catch(err=>{res.status(400).json(err + 'Wrong credentials')})

});


app.post('/register', (req, res)=>{
    const { email, name, password} = req.body;
    const hash = bcrypt.hashSync(password);

  /*  bcrypt.compareSync("bacon", hash); // true
    bcrypt.compareSync("veggies", hash); // false*/
    db.transaction(trx=>{
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail=>{
                return  trx('users')
                    .returning('*')
                    .insert({
                        name: name,
                        email: loginEmail[0],
                        joined: new Date()
                    }).then(user =>{
                        res.json(user[0])
                    })
            })
            .then (trx.commit)
            .then(trx.rollback)

    }).catch(err=> res.status(400).json( 'Could not register user'));


})

app.put('/image', (req, res) =>{
    const {id} = req.body;
    let found = false;
    database.users.forEach(user =>{
        if (user.id === id){
            user.entries++;
            found = true;
            return res.json(user.entries);
        }
    } )

    if(!found){
        res.status(400).json('not found');
    }

});


app.listen(3000, ()=>{
    console.log("App is running on port 3000")
})




// Load hash from your password DB.
/*bcrypt.compare("bacon", hash, function(err, res) {
    // res == true
});
bcrypt.compare("veggies", hash, function(err, res) {
    // res = false
});*/
/*
* --res = this is working
* /signin  --> POST = successful/fail
* /register  --> POST = user
* /profile/:userId --> GET = user
* */