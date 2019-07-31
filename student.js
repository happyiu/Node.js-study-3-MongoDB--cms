var mongoose = require('mongoose')
var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/itcast',{useNewUrlParser:true})

var studentsSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    gender:{
        type: Number,
        default:0,
        enum:[0,1]
    },
    age:{
        type:Number
    },
    hobbies:{
        type:String,
    }
})

module.exports = mongoose.model('Student',studentsSchema)