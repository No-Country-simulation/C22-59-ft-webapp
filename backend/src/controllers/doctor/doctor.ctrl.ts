import {
	create,
	get,
	getAll,
	update,
	deleteById
} from "@services/doctor/doctor.service";
import {Request, Response} from "express";
import {doctorSchema} from "@helpers/doctor/schema.validator";
import {IDoctor} from "@interfaces/doctor";
import {HttpResponse} from "@helpers/error/validation.error";

const httpResponse = new HttpResponse();
export const createDoctor = async ({body}: Request, res: Response): Promise<any> => {
	try {
		const {error, value} = doctorSchema.validate(body);
		if (error) {
			return httpResponse.BadRequest(res, error.details[0].message);
		}
		const doctor = value as IDoctor;
		const createdDoctor = await create(doctor);
		return httpResponse.Ok(res, createdDoctor);
	} catch (error: any) {
		return httpResponse.Error(res, {
			message: "No se pudo crear el doctor",
			error: error.message,
		});
	}
};
export const getDoctorById = async ({params}: Request, res: Response): Promise<any> => {
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
export const updateDoctor = async ({body, params}: Request, res: Response): Promise<any> => {
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
export const deleteDoctorById = async ({params}: Request, res: Response): Promise<any> => {
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
