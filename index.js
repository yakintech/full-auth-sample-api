const express = require('express');
const app = express();
const { userRoutes } = require('./routes/userRoutes');
const { db } = require('./config/db');

app.use(express.json())
app.use('/api/user', userRoutes)

db.connect()


app.get('/',(req,res) => {
    res.send('OK')
})



app.listen(3000, () => {
    console.log('Server is running...');
})






