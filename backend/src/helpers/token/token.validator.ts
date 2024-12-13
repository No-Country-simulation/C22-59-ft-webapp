import {Request, Response, NextFunction} from "express";
import jwt from "jwt-simple";
import moment from "moment";
import {HttpResponse} from "@helpers/error/validation.error";
import {IUser} from "@interfaces/user";

let tokenUser: IUser | undefined;

export function validateToken(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	const httpResponse = new HttpResponse();
	const SECRET_TOKEN = process.env.SECRET_TOKEN;

	if (!SECRET_TOKEN) {
		httpResponse.Error(res, "Secret token not configured");
		return;
	}

	const authorizationHeader = req.headers.authorization;

	if (!authorizationHeader) {
		httpResponse.UnAuthorized(res, "Authorization header missing");
		return;
	}

	const token = authorizationHeader.split(" ")[1];

	if (!token) {
		httpResponse.UnAuthorized(res, "Token missing in authorization header");
		return;
	}

	let payload: any;
	try {
		payload = jwt.decode(token, SECRET_TOKEN);
	} catch (error) {
		httpResponse.BadRequest(res, "Invalid token");
		return;
	}

	if (payload.exp <= moment().unix()) {
		httpResponse.BadRequest(res, "Token expired");
		return;
	}

	tokenUser = payload.sub;
	next();
}
