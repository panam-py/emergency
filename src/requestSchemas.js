const joi = require('joi');

const createPanicSchema = joi.object({
    panicType: joi.string().required().valid("crime", "fire", "health"),
    reporterName: joi.string().required(),
    reporterNumber: joi.string().required(),
    message: joi.string().required(),
    coordinates: joi.string().required(),
    image: joi.string()
});

const createOfficialSchema = joi.object({
    role: joi.string().required().valid("police", "fireman", "doctor"),
    username: joi.string().required(),
    password: joi.string().required().min(8)
})

const loginOfficialSchema = joi.object({
    username: joi.string().required(),
    password: joi.string().required().min(8)
})

module.exports = {
    createPanicSchema,
    createOfficialSchema,
    loginOfficialSchema
};