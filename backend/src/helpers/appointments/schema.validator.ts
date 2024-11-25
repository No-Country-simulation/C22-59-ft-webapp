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
  date: Joi.date().iso().required().messages({
    "date.base": "La fecha debe ser válida.",
    "any.required": "La fecha es obligatoria.",
  }),
  status: Joi.string()
    .valid("scheduled", "completed", "cancelled")
    .default("scheduled"),
  reason: Joi.string().required().messages({
    "any.required": "El motivo de la cita es obligatorio.",
  }),
  notes: Joi.string().optional(),
});