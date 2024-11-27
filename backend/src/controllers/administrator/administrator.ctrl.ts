import { Request, Response } from "express";
import { administratorSchema } from "../../helpers/administrator/schema.validator";
import { IAdministrator } from "../../interfaces/administrator";
import { create } from "../../services/administrator/administrator.service";
import {HttpResponse} from "../../helpers/error/validation.error";
const httpResponse = new HttpResponse();
export const createAdministrator = async (
    {body}: Request,
    res: Response
): Promise<any> => {
  console.log("mamahuevo");
  try {
    const administrator = body as IAdministrator;
    const {error, value} = administratorSchema.validate(administrator);
    if (error) {
      return httpResponse.BadRequest(res, error.details[0].message);
    }
    const createdAdministrator = await create(administrator);
    return httpResponse.Ok(res, createdAdministrator);
  } catch (error: any) {
    return httpResponse.Error(res, {
      message: "Could not create new Administrator",
      error: error.message,
    });
  }
};