import Joi from "joi";

export const doctorSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.base": "El nombre debe ser un texto.",
    "string.min": "El nombre debe tener al menos 2 caracteres.",
    "any.required": "El nombre es obligatorio.",
  }),
  surname: Joi.string().min(2).max(50).required(),
  specialty: Joi.string().required().messages({
    "any.required": "La especialidad es obligatoria.",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "La contraseña debe tener al menos 8 caracteres.",
  }),
  email: Joi.string().email().required(),
  telephone: Joi.string()
    .pattern(/^\+?[0-9]{7,15}$/)
    .required()
    .messages({
      "string.pattern.base": "El teléfono debe ser un número válido.",
    }),
  nationalId: Joi.string().pattern(/^[A-Z0-9]+$/).required().messages({
    "string.pattern.base": "El ID Nacional debe contener solo letras y números.",
  }),
  licenseNumber: Joi.string().required().messages({
    "any.required": "El número de licencia es obligatorio.",
  }),
  workingHours: Joi.object({
    start: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
      "string.pattern.base": "El formato de hora debe ser HH:MM (24h)",
    }),
    end: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    daysOff: Joi.array().items(
      Joi.string().valid("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")
    ),
  }).required(),
  appointments: Joi.array().items(Joi.string().hex().length(24)).optional(),
});