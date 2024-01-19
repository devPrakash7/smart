// studentModel.js
const mongoose = require('mongoose');
const constants = require('../config/constants');
const Schema = mongoose.Schema;

// Define student schema
const studentSchema = new Schema({
   
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    mobileNumber: {
        type: String,
    },
    email: {
        type: String,
    },
    dob: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
    },
    enrolledCourses:{
       type:String
    },
    qualification: {
       type:String
    },
    created_at: {
        type: String,
    },
    updated_at: {
        type: String,
    },
    deleted_at: {
        type: Number,
        default: null,
    },
});

// Output data to JSON
studentSchema.methods.toJSON = function () {
    const student = this;
    const studentObject = student.toObject();
    delete studentObject.password;
    return studentObject;
};

// Define student model
const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
