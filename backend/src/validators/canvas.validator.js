import Joi from 'joi';
import { objectIdPattern, hexColorPattern } from './validationPatterns.js'

const canvasValidationSchema = Joi.object({
    name: Joi.string().required().min(3).max(30).messages({
        "string.min": "Name must be at least 3 characters long",
        "string.max": "Name should not exceed 30 characters long",
        "any.required": "Name is required",
        "string.base": "Name must be a string"
    }),
    width: Joi.number().integer().required().min(10).max(100).default(50).messages({
        "number.min": "Width must be at least 10",
        "number.max": "Width should not exceed 100",
        "any.required": "Width is required",
        "number.base": "Width must be a number",
        "number.integer": "Width must be an integer"
    }),
    height: Joi.number().integer().required().min(10).max(100).default(50).messages({
        "number.min": "Height must be at least 10",
        "number.max": "Height should not exceed 100",
        "any.required": "Height is required",
        "number.base": "Height must be a number",
        "number.integer": "Height must be an integer"
    }),
    colors: Joi.array().items(Joi.string().pattern(hexColorPattern).messages({
        'string.pattern.base': 'Each color must be a valid hex code (e.g., #fff or #ffffff)',
        'string.base': 'Each color must be a string'
    })).optional().messages({
        'array.base': 'Colors must be an array of hex color strings'
    }),
    // password: Joi.string().min(4).optional().allow("").default("").messages({
    //     "string.min": "Password must be at least 4 characters long",
    //     "string.base": "Name must be a string"
    // }),
    // maxPlayers: Joi.number().integer().optional().min(1).max(5).default(1).messages({
    //     "number.min": "Minimum number of players must be at least 1",
    //     "number.max": "Minimum number of players should not exceed 5",
    //     "number.base": "Value must be a number",
    //     "number.integer": "Value must be an integer"
    // }),
    isMain: Joi.boolean().default(false),
    createdBy: Joi.string().required().pattern(objectIdPattern).messages({
        "string.pattern.base": "Invalid ObjectId format for createdBy",
        "any.required": "User is required",
    })
})

export const validateCanvas = (value) =>
    canvasValidationSchema.validate(value, { abortEarly: false });

export const validateCanvasName = (value) =>
    canvasValidationSchema.extract('name').validate(value, { abortEarly: false });
