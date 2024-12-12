import {existByEmail} from "@services/doctor/doctor.service";
import {Request, Response, NextFunction} from "express";

export const isDoctor = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const {email} = req.body;

		if (await existByEmail(email))
			return res.redirect(307, "/api/doctors/auth/login");
	} catch (err: any) {
		next();
	}
	next();
};