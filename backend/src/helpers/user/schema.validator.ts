import Joi from "joi";

export const userSchema = Joi.object({
  birthday: Joi.date().required(),
  name: Joi.string().required(),
  surname: Joi.string().required(),
  nationalId: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  telephone: Joi.string().required(),
  optionalTelephone: Joi.string(),
  blood: Joi.string().required(),
  gender: Joi.string().required(),
  appointment: Joi.date().required(),
});
