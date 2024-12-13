import Joi from "joi";

export const appointmentSchema = Joi.object({
  doctor: Joi.string().hex().length(24).required().messages({
    "any.required": "El ID del doctor es obligatorio.",
    "string.length": "El ID del doctor no es válido.",
  }),
  user: Joi.string().hex().length(24).required().messages({
    "any.required": "El ID del usuario es obligatorio.",
    "string.length": "El ID del usuario no es válido.",
  }),
  date: Joi.string().pattern(new RegExp(/^\d{4}-\d{2}-\d{2}$/)).required().messages({
    "any.required": "La fecha es obligatoria.",
    "string.pattern.base": "La fecha debe ser válida.",
  }),
  status: Joi.string()
    .valid("scheduled", "completed", "cancelled")
    .default("scheduled"),
  reason: Joi.string().required().messages({
    "any.required": "El motivo de la cita es obligatorio.",
  }),
  notes: Joi.string().optional(),
  time: Joi.string().pattern(new RegExp(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)).required().messages({
    "any.required": "La hora es obligatoria.",
    "string.pattern.base": "La hora debe ser válida.",
  }),
});