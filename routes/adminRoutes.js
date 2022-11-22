const express = require("express")
// const adminrouter  = new express.Router();
const adminrouter = express()
const multer = require("multer")
const bcrypt = require("bcrypt")
const session = require("express-session")

// all connection require
require("../db/conn")
const Register = require("../models/usermodel")
const adminController = require("../controllers/admincontrollers")

const config = require("../config/config")
adminrouter.use(session({secret:config.sessionSecret}))
const auth = require("../middleware/auth")



adminrouter.set("view engine", "ejs")
adminrouter.set("views", "./views/admin")

adminrouter.use(express.static("../uploads"))

adminrouter.get('/adminLogin', adminController.login)
adminrouter.post('/adminLogin', adminController.loadLogin)
adminrouter.get('/adminLogin/adminhome', adminController.home)
adminrouter.get('/logout',auth.isLogin, adminController.logoutHome)
adminrouter.get('/dashbord', adminController.dashbord)
adminrouter.get('/admin/export-users',auth.isLogin, adminController.exportusers)
adminrouter.get('/admin/export-users-pdf',auth.isLogin, adminController.exportuserspdf)

adminrouter.get('*', function(req, res){
    res.redirect('/adminlogin')
})





module.exports = adminrouter;