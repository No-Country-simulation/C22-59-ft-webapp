import { Request, Response } from "express";
import { HttpResponse } from "../../helpers/error/validation.error";
import { create } from "../../services/user/user.service";
import { userSchema, loginSchema } from "../../helpers/user/schema.validator";
import { login } from "../../services/user/user.service";
import { createToken } from "../../helpers/token/token.creator";
import bcrypt from "bcrypt";

const httpResponse = new HttpResponse();

export const createUser = async (
  { body }: Request,
  res: Response
): Promise<any> => {
  try {
    const { error, value } = userSchema.validate(body);
    if (error) {
      httpResponse.BadRequest(res, error.details[0].message);
    }
    const { password, ...rest } = value;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { ...rest, password: hashedPassword };
    const createdUser = await create(user);
    const userObject = createdUser.toObject();
    const { password: _, ...restData } = userObject;

    return httpResponse.Ok(res, { data: restData });
  } catch (err: any) {
    return httpResponse.Error(res, {
      message: "Could not create new User",
      error: err.message,
    });
  }
};

export const loginUser = async (
  { body }: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, password } = body;

    const { error } = loginSchema.validate({ email, password });
    if (error)
      return httpResponse.Error(res, "Verifique la Información Ingresada");

    const user = await login(email, password);
    const token = await createToken(user);
    return httpResponse.Ok(res, { data: { token } });
  } catch (err: any) {
    return httpResponse.Error(res, {
      message: "Could not log in User",
      error: err.message,
    });
  }
};
