import {existByEmail} from "@services/administrator/administrator.service";
import {Request, Response, NextFunction} from "express";

export const isAdministrator = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const {email} = req.body;

		if (await existByEmail(email))
			return res.redirect(307, "/api/administrator/auth/login");
	} catch (err: any) {
		next();
	}
	next();
};
