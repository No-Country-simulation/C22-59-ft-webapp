import Joi from "joi";

export const administratorSchema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({	
        "string.base": "El nombre debe ser un texto.",
        "string.min": "El nombre debe tener al menos 2 caracteres.",
        "any.required": "El nombre es obligatorio.",
    }),
    surname: Joi.string().min(2).max(50).required(),
    nationalId: Joi.string().pattern(/^[A-Z0-9]+$/).required().messages({
        "string.pattern.base": "El ID Nacional debe contener solo letras y números.",
    }),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required().messages({
        "string.min": "La contraseña debe tener al menos 8 caracteres.",
    }),
    telephone: Joi.string()
        .pattern(/^\+?[0-9]{7,15}$/)
        .required()
        .messages({
            "string.pattern.base": "El teléfono debe ser un número válido.",
        }),
});