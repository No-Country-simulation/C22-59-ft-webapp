import {
	create,
	get,
	getAll,
	update,
	deleteById,
	login,
} from "@services/doctor/doctor.service";
import {Request, Response} from "express";
import {doctorSchema} from "@helpers/doctor/schema.validator";
import {IDoctor} from "@interfaces/doctor";
import {HttpResponse} from "@helpers/error/validation.error";
import {createToken} from "@helpers/token/token.creator";
import {emailExists} from "@helpers/validator.roles";
import bcryptjs from "bcryptjs";
import { loginSchema } from "@helpers/user/schema.validator";

const httpResponse = new HttpResponse();

export const createDoctor = async (
	{body}: Request,
	res: Response
): Promise<any> => {
	try {
		const {error, value} = doctorSchema.validate({
			...body,
			workingHours: {
				start: "08:00",
				end: "17:00",
				daysOff: ["Saturday", "Sunday"],
			},
		});

		if (error) {
			return httpResponse.BadRequest(res, error.details[0].message);
		}
		const {password, ...rest} = value;
		const hashedPassword = await bcryptjs.hash(password, 10);
		const doctor = {...rest, password: hashedPassword} as IDoctor;

		if (await emailExists(doctor.email)) {
			return httpResponse.BadRequest(res, "Email ya existe");
		}

		const createdDoctor = await create(doctor);
		return httpResponse.Ok(res, createdDoctor);
	} catch (error: any) {
		return httpResponse.Error(res, {
			message: "No se pudo crear el doctor",
			error: error.message,
		});
	}
};

export const loginDoctor = async (
	{body}: Request,
	res: Response
): Promise<any> => {
	const {email, password} = body;
	console.log("VALIDANDO DOCTOR");
	const {error} = loginSchema.validate({email, password});
	if (error) {
		return httpResponse.BadRequest(res, error.details[0].message);
	}
	try {
		const doctor = await login(email, password);
		const token = await createToken(doctor);
		return httpResponse.Ok(res, {token});
	} catch (error: any) {
		return httpResponse.Error(res, {
			message: "No se pudo crear el doctor",
			error: error.message,
		});
	}
};
export const getDoctorById = async (
	{params}: Request,
	res: Response
): Promise<any> => {
	try {
		const doctor = await get(params.id);
		return httpResponse.Ok(res, doctor);
	} catch (error: any) {
		return httpResponse.Error(res, {
			message: "No se pudo obtener el doctor",
			error: error.message,
		});
	}
};
export const getDoctors = async (_: Request, res: Response): Promise<any> => {
	try {
		const doctors = await getAll();
		return httpResponse.Ok(res, doctors);
	} catch (error: any) {
		return httpResponse.Error(res, {
			message: "No se pudieron obtener los doctores",
			error: error.message,
		});
	}
};
export const updateDoctor = async (
	{body, params}: Request,
	res: Response
): Promise<any> => {
	try {
		const {error, value} = doctorSchema.validate(body);
		if (error) {
			return httpResponse.BadRequest(res, error.details[0].message);
		}
		const doctor = value as IDoctor;
		const updatedDoctor = await update(params.id, doctor);
		return httpResponse.Ok(res, updatedDoctor);
	} catch (error: any) {
		return httpResponse.Error(res, {
			message: "No se pudo actualizar el doctor",
			error: error.message,
		});
	}
};
export const deleteDoctorById = async (
	{params}: Request,
	res: Response
): Promise<any> => {
	try {
		deleteById(params.id);
		return httpResponse.Ok(res);
	} catch (error: any) {
		return httpResponse.Error(res, {
			message: "No se pudo eliminar el doctor",
			error: error.message,
		});
	}
};
