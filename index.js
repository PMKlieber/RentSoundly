const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');
const app = express()
const cors = require('cors');
const db = require('./queries')
const port = 3000
const ViteExpress = require("vite-express");

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(cors({
    origin: '*'
}));





app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.get('/prop/:id', db.getPropertyById)
app.get('/issues/:id', db.getPropertyIssues)
app.get('/landlordprops/:id', db.getPropertyByLandlord)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));

/*app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})*/
