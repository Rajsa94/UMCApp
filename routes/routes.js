const express = require("express")
const router = express()
// const router  = new express.Router();
const multer = require("multer")
const bcrypt = require("bcrypt")
const session = require("express-session")
// all connection require
require("../db/conn")
const Register = require("../models/usermodel")
const userController = require("../controllers/userController")

const config = require("../config/config")
router.use(session({secret:config.sessionSecret}))
const auth = require("../middleware/auth")

router.set("view engine", "ejs")


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    }
  });
  
  // this code will handle file types like jpeg, jpg, and png
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
  
  var upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5 // define limit 5mb max file upload size
    },
    fileFilter: fileFilter
  });
  router.use(express.static("../uploads"))

router.get('/',auth.isLogout, userController.lodRegister)
router.post('/',upload.single('image'), userController.insertUser)
router.get('/verify', userController.verifyMail)
router.get('/login',auth.isLogout, userController.login)
router.post('/login', userController.loginForm)
router.get('/home',auth.isLogin, userController.Home)
router.get('/logout',auth.isLogin, userController.logoutHome)
router.get('/forget',auth.isLogout, userController.forgate)
router.post('/forget', userController.forgatePassword)
router.get('/forget-password',auth.isLogout, userController.forgatePasswordLoad)
router.post('/forget-password',auth.isLogout, userController.forgatePasswordReset)
router.get('/Verification',auth.isLogout, userController.Verification)
router.post('/Verification',auth.isLogout, userController.sendVerification)
router.get('/edit/:id', userController.edit)
router.post('/edit/:id',upload.single('image'), userController.editUpdate)
router.get('/delete/:id', userController.Delete)



  module.exports = router;