<<<<<<< HEAD
import { Request, Response } from "express";
import { administratorSchema } from "../../helpers/administrator/schema.validator";
import { IAdministrator } from "../../interfaces/administrator";
import { create,login } from "../../services/administrator/administrator.service";
import { createToken } from "../../helpers/token/token.creator";
import {HttpResponse} from "../../helpers/error/validation.error";
import bcryptjs from "bcryptjs";
=======
import {Request, Response} from "express";
import {administratorSchema} from "@helpers/administrator/schema.validator";
import {IAdministrator} from "@interfaces/administrator";
import {create, login} from "@services/administrator/administrator.service";
import {createToken} from "@helpers/token/token.creator";
import {HttpResponse} from "@helpers/error/validation.error";
import {emailExists} from "@helpers/validator.roles";
import bcrypt from "bcrypt";
>>>>>>> 45aa9996d1cc4aa52713c896d940293b5350edd4
const httpResponse = new HttpResponse();
export const createAdministrator = async (
	{body}: Request,
	res: Response
): Promise<any> => {
<<<<<<< HEAD
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
=======
	try {
		const {error, value} = administratorSchema.validate(body);
		if (error) {
			return httpResponse.BadRequest(res, error.details[0].message);
		}

		const {password, ...rest} = value;
		const hashedPassword = await bcrypt.hash(password, 10);
		const administrator = {...rest, password: hashedPassword} as IAdministrator;

		if (await emailExists(administrator.email)) {
			return httpResponse.BadRequest(res, "Email ya existe");
		}

		const createdAdministrator = await create(administrator);
		return httpResponse.Ok(res, createdAdministrator);
	} catch (error: any) {
		return httpResponse.Error(res, {
			message: "No se pudo crear Administrador",
			error: error.message,
		});
	}
>>>>>>> 45aa9996d1cc4aa52713c896d940293b5350edd4
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
