import { Request, Response } from "express";
import { HttpResponse } from "../../helpers/error/validation.error";
import { IAdmin } from "interfaces/admin";

const httpResponse = new HttpResponse();

export const createAdmin = async({ body }: Request, res: Response):Promise<Object>=> {
  try {
    const { name, email, password } = body;
    const admin: IAdmin = { name, email, password };

    return httpResponse.Ok(res, admin);
  } catch (err) {
    return httpResponse.BadRequest(res, {
      message: "Invalid request",
      error: err,
    });
  }
};
