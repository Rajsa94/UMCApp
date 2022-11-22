// getting-started.js
const mongoose = require('mongoose');




//  mongoose.connect('mongodb://localhost:27017/register')
//  .then(()=>{
//     console.log("connection is succesful")
//  }).catch(()=>{
//     console.log("connection is not succesful")
//  })
 
mongoose.connect("mongodb+srv://Rathore:Ra9680879504%23@cluster0.1dhc6u9.mongodb.net/register", {  useUnifiedTopology: true })
.then(()=>{
    console.log('connection is successful');
}).catch(err => {
    console.log('Connection failed...')
});
  
  