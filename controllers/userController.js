const Register = require("../models/usermodel")

const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")
const session = require("express-session")
const router = require("../routes/routes")

const configr = require("../config/config")
var randomstring = require('randomstring')
const { findByIdAndUpdate } = require("../models/usermodel")




const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message)
    }
}
// for mail verify
const sendVerifyMail = async (name, email, user_id) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            service: 'gmail',
            auth: {
                user: 'rathore94.uda@gmail.com',
                pass: 'jtcfmmipnlkquryf',
            },

        });
        const mailOption = ({
            from: 'rathore94.uda@gmail.com',
            to: email,
            subject: 'For Verify mail',

            html: '<p>Hii ' + name + ',Please click on the link to verify your account<a href="http://localhost:8000/verify?id=' + user_id + '">Verify Email</a>your </p>'
        });
        transporter.sendMail(mailOption, function (error, info) {
            try {
                console.log(error.message)
            } catch (error) {
                console.log("email has been sent:-", info.response)
            }
        })

    } catch (error) {
        console.log(error.message)
    }
}
const sendResetPasswordMail = async (name, email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            service: 'gmail',
            auth: {
                user: 'rathore94.uda@gmail.com',
                pass: 'jtcfmmipnlkquryf',
            },

        });
        const mailOption = ({
            from: 'rathore94.uda@gmail.com',
            to: email,
            subject: 'For Reset Password',

            html: '<p>Hii ' + name + ',Please click on the link to verify your account<a href="http://localhost:8000/forget-password?token=' + token + '">Reset</a>your  Password </p>'
        });
        transporter.sendMail(mailOption, function (error, info) {
            try {
                console.log(error.message)
            } catch (error) {
                console.log("email has been sent:-", info.response)
            }
        })

    } catch (error) {
        console.log(error.message)
    }
}

const lodRegister = async (req, res) => {
    try {
        res.render("register")
    } catch (error) {
        console.log(error.message)
    }
}
const insertUser = async (req, res) => {
    try {
        const sPassword = await securePassword(req.body.password)
        const registerEmp = new Register({
            name: req.body.name,
            mobile: req.body.phone,
            email: req.body.email,
            password: sPassword,
            Image: req.file.filename,
            is_admin: 0,

        })
        const raj = await registerEmp.save()
        if (raj) {
            sendVerifyMail(req.body.name, req.body.email, raj._id)
            res.render("register", { message: "your Registration is success" })

        } else {
            res.render("register", { message: "your Registration is failed" })
        }

    } catch (error) {
        console.log(error.message)
    }
}
const verifyMail = async (req, res) => {
    try {
        const updateInfo = await Register.updateOne({ _id: req.query.id }, { $set: { is_varified: 1 } });
        console.log(updateInfo)
        res.render("email-verified")

    } catch (error) {
        console.log(error.message)
    }
}
const login = async (req, res) => {
    res.render("login")
}
const loginForm = async (req, res) => {

    try {
        const email = req.body.Email
    const Password = req.body.password
    const Useremail = await Register.findOne({ email: email })
    // console.log(Useremail.password)
    const isMatch = bcrypt.compare(Password, Useremail.password);

    // if (Useremail.password === Password) {
    //     res.render("register")
    // } else {
    //     res.send("pasward are not matching")
    // }
    if (isMatch) {
        // res.render("home", {data:useremail})

        req.session.user_id = Useremail._id;

        // res.render("login", { message: "your Login is success" })
        res.redirect("home")


    } 
    else {
        res.send("pasward are not matching")
        // res.render("login", { message: "your Login is success" })
        // res.redirect("/")
    }
    } catch (error) {
        // res.redirect("home")
        res.render("login", { message: "your Login is not success" })
    }
    
    // res.redirect("home")
    

}


const Home = async (req, res) => {
    // Register.find({}, (err, items) => {
    //     if (err) {
    //         console.log(err);
    //         res.status(500).send('An error occurred', err);
    //     }
    //     else {
    //         res.render('home', { items: items });
    //     }
    // });
    const items = await Register.findById({ _id: req.session.user_id })
    console.log(req.session.user_id)
    res.render('home', { image: items });
}
const logoutHome = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect("/login")
    } catch (error) {
        console.log(error.message)
    }
}
const forgate = async (req, res) => {
    res.render("forget")

}

const forgatePassword = async (req, res) => {
    try {
        const email = req.body.email;

        const userData = await Register.findOne({ email: email });

        if (userData) {

            if (userData.is_varified === 0) {
                res.render('forget', { message: "pleace verify your mail " })
            }
            else {
                const randomString = randomstring.generate({
                    length: 12,
                    charset: 'alphabetic'
                });
                console.log(randomString)
                const updateData = await Register.updateOne({ email: email }, { $set: { token: randomString } })

                sendResetPasswordMail(userData.name, userData.email, randomString);
                res.render("forget", { message: "please check your mail reset your password" })


            }
        } else {
            res.render("forget", { message: "mail is incorrect" })

        }


    } catch (error) {
        console.log(error.message)
    }

}
const forgatePasswordLoad = async (req, res) => {
    try {
        const token = req.query.token;
        const tokenData = await Register.findOne({ token: token })
        if (tokenData) {
            res.render("forget-password", { Register_id: tokenData._id })
        } else {
            res.render("404", { message: "page not found" })
        }
    } catch (error) {
        console.log(error.message)
    }
}
const forgatePasswordReset = async (req, res) => {
    try {
        const Password = req.body.password;

        const user_id = req.body.Register_id;
        const secure_password = await securePassword(Password);

        const upadedata = await Register.findByIdAndUpdate({ _id: user_id }, { $set: { password: secure_password, token: '' } })
        res.redirect("/")



    } catch (error) {
        console.log(error.message)
    }
}
const Verification = async (req, res) => {
    try {
        res.render("Verification")
    } catch (error) {
        console.log(error.message)
    }
}
const sendVerification = async (req, res) => {
    try {
        const email = req.body.email;
        const VerifyMail = await Register.findOne({ email: email })

        if (VerifyMail) {
            sendVerifyMail(req.body.name, req.body.email, VerifyMail._id)
            res.render("Verification", { message: "Mail has been send " })

        } else {
            res.render("Verification", { message: "your your Verification is failed" })
        }


    } catch (error) {
        console.log(error.message)
    }
}
const edit = async (req, res) => {
    const userid = await Register.findById(req.params.id)

    res.render("edit", {
        deta: userid
    })
}
const editUpdate = async (req, res) => {
    const raj = ({
        name: req.body.name,
        mobile: req.body.phone,
        email: req.body.email,
        image: req.file.image,

    })
    const updateprofile = await Register.findByIdAndUpdate(req.params.id, raj)
    res.render("edit")
    res.redirect("/home")
}
const Delete = async (req, res) => {
    const raj = await Register.findByIdAndRemove(req.params.id)
    res.render("edit")
    res.redirect("/")

}





module.exports = {
    lodRegister,
    insertUser,
    verifyMail,
    login,
    loginForm,
    Home,
    logoutHome,
    forgate,
    forgatePassword,
    forgatePasswordLoad,
    forgatePasswordReset,
    Verification,
    sendVerification,
    edit,
    editUpdate,
    Delete
}