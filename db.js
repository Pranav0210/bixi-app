const mongoose = require('mongoose')

const dbConnect = (uri)=>{
    return mongoose.connect(uri, {
        useUnifiedTopology:true
    })
    .then(()=>{
        console.log("Connection to DB established successfully...")
    })
    .catch(()=>{
        console.log("Failed to connect to Database...")
    });
}

module.exports = dbConnect;