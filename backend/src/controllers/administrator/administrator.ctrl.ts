import { Request, Response } from "express";
import { administratorSchema } from "../../helpers/administrator/schema.validator";
import { IAdministrator } from "../../interfaces/administrator";
import { create,login } from "../../services/administrator/administrator.service";
import { createToken } from "../../helpers/token/token.creator";
import {HttpResponse} from "../../helpers/error/validation.error";
import bcryptjs from "bcryptjs";
const httpResponse = new HttpResponse();
export const createAdministrator = async (
	{body}: Request,
	res: Response
): Promise<any> => {
  try {
    
    const {error, value} = administratorSchema.validate(body);
    if (error) {
      return httpResponse.BadRequest(res, error.details[0].message);
    }
    const { password, ...rest } = value;
    const hashedPassword = await bcryptjs.hash(password, 10);
    const administrator = { ...rest, password: hashedPassword } as IAdministrator;
    const createdAdministrator = await create(administrator);
    return httpResponse.Ok(res, createdAdministrator);
  } catch (error: any) {
    return httpResponse.Error(res, {
      message: "Could not create new Administrator",
      error: error.message,
    });
  }
};
export const loginAdministrator = async (
	{body}: Request,
	res: Response
): Promise<any> => {
	try {
		const {email, password} = body;
		const administrator = await login(email, password);
		const token = await createToken(administrator);

		return httpResponse.Ok(res, {data: {token}});
	} catch (err: any) {
		return httpResponse.Error(res, {
			message: "No se pudo loguear Administrador",
			error: err.message,
		});
	}
};
