import { Request, Response } from "express";
import { HttpResponse } from "../../helpers/error/validation.error";
import { create } from "../../services/user/user.service";
import { userSchema } from "../../helpers/user/schema.validator";
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
