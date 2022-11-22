const Register = require("../models/usermodel")

const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")
const adminrouter = require("../routes/adminRoutes")

const configr = require("../config/config")

const session = require("express-session")
const excelJS = require("exceljs")

// html to pdf genrate require
const ejs = require("ejs")
const pdf = require("html-pdf")
const fs = require("fs")
const path = require("path")


const login = async (req, res)=>{
    try {
        res.render("adminlogin")
    } catch (error) {
        console.log(error.message)
    }
}
const loadLogin = async (req, res)=>{
    try {
        const email = req.body.Email;
        const password = req.body.password
        
        const adminData = await Register.findOne({email:email});
        if (adminData) {
            const passwordMatch =  bcrypt.compare(password,adminData.password);
            if (passwordMatch) {
                if (adminData.is_admin === 0) {
                    res.render("adminlogin", {message:"login is not not not success"})
                    
                }
                else{
                    req.session.user_id = adminData._id;
                    console.log(req.session.user_id)
                // res.render("adminlogin", {message:"login  success"} )
                res.redirect("/adminLogin/adminhome")
            }
        } else {
            res.render("adminlogin", {message:"login is not not success"})
        }

        
       } else {
        res.render("adminlogin", {message:"login is not success"})
       }


    } catch (error) {
        console.log(error.message)
    }
}
const home = async (req, res)=>{
    try {
        const userData = await Register.findById({_id:req.session.user_id})
        // console.log(userData)

        res.render("adminhome", {image:userData})
    } catch (error) {
        console.log(error.message)
    }
}

const logoutHome = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect("/adminlogin")
    } catch (error) {
        console.log(error.message)
    }
}
const dashbord = async (req, res) => {
    try {
        let search = '';
        if (req.query.search) {
            search = req.query.search
        }
        let page = 1;
        if (req.query.page) {
            search = req.query.page
        }
        const limit = 2;



        const data = await Register.find({
            $or:[
                {name:{ $regex:'.*'+ search +'.*',$options:'i'}},
                {email:{ $regex:'.*'+ search +'.*',$options:'i'}},
                {mobile:{ $regex:'.*'+ search +'.*',$options:'i'}},
                
            ]
        })
        .limit(limit * 1)
        .skip((page - 1)* limit)
        .exec();

        const count = await Register.find({
            $or:[
                {name:{ $regex:'.*'+ search +'.*',$options:'i'}},
                {email:{ $regex:'.*'+ search +'.*',$options:'i'}},
                {mobile:{ $regex:'.*'+ search +'.*',$options:'i'}},
                
            ]
        }).countDocuments();
        
        res.render("dashbord" ,{
            items:data,
            totalPages: Math.ceil(count/limit),
            currentPage: page

        })
    } catch (error) {
        console.log(error.message)
    }
}
const exportusers = async (req, res) => {
    try {
        const workbook = new excelJS.Workbook()
        const worksheet = workbook.addWorksheet("MY Users")

        worksheet.columns = [
            {header:"S no.",key:"S_no",width: 10},
            {header:"Name",key:"name",width: 32},
            {header:"Email",key:"email",width: 15},
            {header:"Mobile",key:"mobile",width: 20}
        ]
        let counter = 1;
        const userdata = await Register.find({})
        userdata.forEach((user)=>{
            user.s_no = counter;

            worksheet.addRow(user)

            counter++;
        })
        worksheet.getRow(1).eachCell((cell)=>{
            cell.font = {bold:true}
        })
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet");
        res.setHeader("Content-Disposition", `attatchement; filename=users.xlsx`);
        return workbook.xlsx.write(res).then(()=>{
            res.status(200);
        })
    } catch (error) {
        console.log(error.message)
    }
}
const exportuserspdf = async (req, res) => {
    try {
        const users = await Register.find({})
        const data ={
            users:users
        }
        const filepathName = path.resolve(__dirname, "../views/admin/htmltopdf.ejs")
        const htmlString = fs.readFileSync(filepathName).toString();
        let options = {
            format:'A3',
            orientation:"portrait"
        }
        const ejsData = ejs.render(htmlString, data)

        pdf.create(ejsData, options).toFile('users.pdf', (err, response)=> {
            if (err)  console.log(err);
            // res.redirect("/dashboard")
            // console.log(res); // { filename: '/app/businesscard.pdf' }
            const filePath = path.resolve(__dirname, '../users.pdf')
            fs.readFile(filePath, (err,file)=>{
                if (err) {
                    console.log(err)
                    return res.status(500).send("conuld not dolade file")
                }
                res.setHeader('content-Type', 'application/pdf');
                res.setHeader('content-Disposition', 'attachment;filename="users.pdf"');
                res.send(file);
                

            })
            
          });
    } catch (error) {
        console.log(error.message)
    }
}
module.exports = {
    login,
    loadLogin,
    home,
    logoutHome,
    dashbord,
    exportusers,
    exportuserspdf
   
}