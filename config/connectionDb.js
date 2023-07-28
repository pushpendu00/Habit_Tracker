const mongoose = require('mongoose');
var db = connectionFun();

async function connectionFun(){
    try{
        db = await mongoose.connect("mongodb://127.0.0.1:27017/habitTracker");
        if(db){
            console.log('Database are connected.....');
            return db;
        }
    }catch(err){
        console.log(err);
    }
}


module.exports = db;