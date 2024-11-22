import Joi from "joi";

export const userSchema = Joi.object({
  birthday: Joi.date().iso().required().messages({
    "date.base": "La fecha de nacimiento debe ser válida.",
    "any.required": "La fecha de nacimiento es obligatoria.",
  }),
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
  optionalTelephone: Joi.string().pattern(/^\+?[0-9]{7,15}$/).optional(),
  blood: Joi.string().valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-").required(),
  gender: Joi.string().valid("Masculino", "Femenino", "Otro").required(),
  appointments: Joi.array().items(Joi.string().hex().length(24)).optional(),
});


export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required().messages({
    "string.min": "La contraseña debe tener al menos 8 caracteres.",
  }),
})