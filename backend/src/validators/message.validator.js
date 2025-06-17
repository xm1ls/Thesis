import Joi from 'joi'
import { messageContentPattern, objectIdPattern } from './validationPatterns.js'

const messageValidationSchema = Joi.object({
    content: Joi.string().min(1).max(60).required().pattern(messageContentPattern).messages({
        "string.min": "Message content must be at least 1 characters long",
        "string.max": "Message content should not exceed 60 characters long",
        "any.required": "Message content is required",
        "string.base": "Message content must be a string",
        "string.pattern.base": "Invalid content format for message"
    }),
    sender: Joi.string().required().pattern(objectIdPattern).messages({
        "string.pattern.base": "Invalid ObjectId format for placedBy",
        "any.required": "User is required",
    }),
    lobby: Joi.string().pattern(objectIdPattern).optional().allow(null, "").messages({
        "string.pattern.base": "Invalid ObjectId format for lobby",
    }),
    canvas: Joi.string().pattern(objectIdPattern).optional().allow(null, "").messages({
        "string.pattern.base": "Invalid ObjectId format for canvas",
    })
})

export const validateMessage = (value) =>
    messageValidationSchema.validate(value, { abortEarly: false });