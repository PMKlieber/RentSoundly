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



//app.use(express.static('public'))

app.get('/prop/:id', db.getPropertyById)
app.get('/issues/:id', db.getPropertyIssues)
app.get('/landlordprops/:id', db.getPropertyByLandlord)

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));

/*app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})*/
