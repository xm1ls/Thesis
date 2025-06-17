import Joi from 'joi'
import { hexColorPattern, objectIdPattern } from './validationPatterns.js'

const pixelValidationSchema = Joi.object({
    x: Joi.number().integer().required().min(0).messages({
        "number.base": "X coordinate must be a number",
        "number.min": "Value of X cannot be less than 0",
        "any.required": "X coordinate is required",
        "number.integer": "Value of X must be an integer"
    }),
    y: Joi.number().integer().required().min(0).messages({
        "number.base": "Y coordinate must be a number",
        "number.min": "Value of Y cannot be less than 0",
        "any.required": "Y coordinate is required",
        "number.integer": "Value of Y must be an integer"
    }),
    color: Joi.string().pattern(hexColorPattern).required().messages({
        "string.pattern.base": "Invalid color hex code (e.g., #FFFFFF or #FFF)",
        "any.required": "Color is required",
    }),
    placedBy: Joi.string().required().pattern(objectIdPattern).messages({
        "string.pattern.base": "Invalid ObjectId format for placedBy",
        "any.required": "User is required",
    }),
    canvas: Joi.string().required().pattern(objectIdPattern).messages({
        "string.pattern.base": "Invalid ObjectId format for canvas",
        "any.required": "Canvas is required",
    })
})

export const validatePixel = (value) =>
    pixelValidationSchema.validate(value, { abortEarly: false });