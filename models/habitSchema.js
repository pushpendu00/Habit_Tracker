const { default: mongoose } = require('mongoose');
const db = require('../config/connectionDb');
const { required } = require('nodemon/lib/config');

const habitSchema = mongoose.Schema({
    habitName : {
        type : String,
        required : true,
        unique : true
    },
    addDate :{
        type : String
    },
    totalDay :{
        type : Number,
        // required : true,
        default : 1
    },
    workDay : {
        type : Number,
        default : 0
    },
    oneweek : [
        {
            date :{
                type : Number
            },
            month : {
                type : Number
            },
            year : {
                type : Number
            },
            status : {
                type : Boolean,
                // default : false
            }
        }  
    ]
});

const habitmodel = new mongoose.model('habit',habitSchema);




module.exports = habitmodel;