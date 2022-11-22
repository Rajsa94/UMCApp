const express = require('express')
const app = express()
const port = process.env.PORT || 3300
const path = require("path")

// all connection require
// require("./db/conn")
// const Register = require("./models/usermodel")
const userController = require("./routes/routes")
const adminController = require("./routes/adminRoutes")

// console.log(path.join(__dirname, "./public"))
const csspath = path.join(__dirname, "./public")
app.use(express.static("uploads"))

// static file
app.use(express.static(csspath))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(userController)
app.use(adminController)


// app.set("view engine", "ejs")
// app.set("views", "./views/admin")

app.get('/', (req, res) => {
  res.render("register")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})