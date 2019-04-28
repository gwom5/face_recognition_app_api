const express = require('express');
const bcrypt = require('bcrypt-nodejs')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());

app.use(bodyParser.json());
const database = {
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
}

app.get('/', function(req, res){
    res.send(database.users);
})

app.get('/profile/:id', function(req, res){
    const {id} = req.params;
    let found = false;

    database.users.forEach(user =>{
        if(user.id === id){
        found = true;
        return res.json(user);
    }
    })
    if (!found) {
        return res.status(400).json('no such user');
    }

});

app.post('/image', (req, res)=>{
    const {id} = req.body;
    let found = false;

    database.users.forEach(user =>{
        if(user.id === id){
        found = true;
        user.entries ++;
        return res.json(user.entries);
    }
    })
    if (!found) {
        return res.status(400).json('no such user');
    }
});


app.post('/signin', (req, res) =>{
    if(req.body.email === database.users[0].email && req.body.password=== database.users[0].password)
    {

        res.json(database.users[0]);
    }
    else
    {
        res.status(400).json('error logging in');
    }
});


app.post('/register', (req, res)=>{
    const { email, name, password} = req.body;

    /*bcrypt.hash(password, null, null, function(err, hash) {
        // Store hash in your password DB.
        console.log(hash);
    });*/
    database.users.push({
       /* id: id,*/
        name: name,
        password: password,
        email: email,
        entries: 0,
        joined: new Date()
    })

    res.json(database.users[database.users.length-1]);
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