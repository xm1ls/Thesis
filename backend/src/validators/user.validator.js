import Joi from 'joi'
import { objectIdPattern } from './validationPatterns.js'

const userValidationSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        'string.base': "Email must be a string",
        'string.email': "Email must be a valid email address",
        'any.required': "Email is required"
    }),
    name: Joi.string().required().min(3).max(30).messages({
        "string.min": "Name must be at least 3 characters long",
        "string.max": "Name should not exceed 30 characters long",
        "any.required": "Name is required",
        "string.base": "Name must be a string"
    }),
    pixelsPlaced: Joi.number().integer().min(0).messages({
        "number.integer": "Value of pixels must be an integer",
        "number.min": "Value of pixels cannot be less than 0",
    }),
    currentLobby: Joi.string().required().pattern(objectIdPattern).messages({
        "string.pattern.base": "Invalid ObjectId format for currentLobby",
        "any.required": "currentLobby is required",
    }),
})

export const validateUser = (value) =>
    userValidationSchema.validate(value, { abortEarly: false });