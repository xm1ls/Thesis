import Joi from 'joi';
import { objectIdPattern } from './validationPatterns.js'

const lobbyValidationSchema = Joi.object({
    name: Joi.string().required().min(3).max(30).messages({
        "string.min": "Name must be at least 3 characters long",
        "string.max": "Name should not exceed 30 characters long",
        "any.required": "Name is required",
        "string.base": "Name must be a string"
    }),
    password: Joi.string().min(4).optional().allow(null, "").default("").messages({
        "string.min": "Password must be at least 4 characters long",
        "string.base": "Password must be a string"
    }),
    maxPlayers: Joi.number().integer().optional().min(1).max(10).default(1).messages({
        "number.min": "Minimum number of players must be at least 1",
        "number.max": "Minimum number of players should not exceed 5",
        "number.base": "Value must be a number",
        "number.integer": "Value must be an integer"
    }),
    createdBy: Joi.string().required().pattern(objectIdPattern).messages({
        "string.pattern.base": "Invalid ObjectId format for createdBy",
        "any.required": "User is required",
    }),
    canvas: Joi.string().pattern(objectIdPattern).messages({
        "string.pattern.base": "Invalid ObjectId format for canvas",
        // "any.required": "Canvas is required",
    })
})

export const validateLobby = (value) =>
    lobbyValidationSchema.validate(value, { abortEarly: false });

export const validateLobbyName = (value) =>
    lobbyValidationSchema.extract('name').validate(value, { abortEarly: false });
