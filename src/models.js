const { Schema, model } = require('mongoose');

const panicSchema = new Schema({
    panicType: {type: String, enum: ["crime", "fire", "health"]},
    reporterName: {type: String, required: true},
    reporterNumber: {type: String, required: true},
    message: {type: String},
    coordinates: {type: String, required: true},
    active: {type: Boolean, default: true},
    image: {type: String}
}, {
    timestamps: true
});

const authSchema = new Schema({
    role: {type: String, enum: ["police", "fireman", "doctor"]},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
}, {
    timestamps: true
});


const Panic = model("Panic", panicSchema);
const Auth = model("Auth", authSchema);


module.exports = {Panic, Auth};