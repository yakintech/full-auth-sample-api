const express = require('express');
const app = express();
const { userRoutes } = require('./routes/userRoutes');
const { db } = require('./config/db');
app.use(express.json());
var jwt = require('jsonwebtoken');


db.connect()



app.get('/',(req,res) => {
    res.send('OK')
})

app.get('/dashboard', (req,res) => {
    res.send("Dashboard");
})

app.use('/api/user', userRoutes)


app.post("/token", (req,res) => {

    let token = req.body.token;


    try {
        jwt.verify(token, "lambofgod");
        res.send("OK");
    } catch (error) {
        res.status(500).send("Token EXPIRE!");
    }

    

})



app.listen(3000, () => {
    console.log('Server is running...');
})






