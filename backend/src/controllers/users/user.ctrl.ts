import { Request, Response } from "express";
import { HttpResponse } from "../../helpers/error/validation.error";
import { create, get, getById } from "../../services/user/user.service";
import { userSchema, loginSchema } from "../../helpers/user/schema.validator";
import { login } from "../../services/user/user.service";
import { createToken } from "../../helpers/token/token.creator";
import bcryptjs from "bcryptjs";
import userModel from "../../models/users/user.model";
import { emailExists } from "../../helpers/validator.roles";

const httpResponse = new HttpResponse();

export const createUser = async (
	{body}: Request,
	res: Response
): Promise<any> => {
	try {
		const {error, value} = userSchema.validate(body);
		if (error) {
			httpResponse.BadRequest(res, error.details[0].message);
		}
		const {password, ...rest} = value;
		const hashedPassword = await bcryptjs.hash(password, 10);
		const user = {...rest, password: hashedPassword};
		
		if (await emailExists(user.email)) {
			return httpResponse.BadRequest(res, "Email ya existe");
		}

		const createdUser = await create(user);
		const userObject = createdUser.toObject();
		const {password: _, ...restData} = userObject;

		return httpResponse.Ok(res, {data: restData});
	} catch (err: any) {
		return httpResponse.Error(res, {
			message: "Could not create new User",
			error: err.message,
		});
	}
};

export const loginUser = async (
	{body}: Request,
	res: Response
): Promise<any> => {
	try {
		const {email, password} = body;

		const {error} = loginSchema.validate({email, password});
		if (error)
			return httpResponse.BadRequest(res, "Verifique la Información Ingresada");

		const user = await login(email, password);
		const token = await createToken(user);
		return httpResponse.Ok(res, {data: {token}});
	} catch (err: any) {
		return httpResponse.Error(res, {
			message: "Could not log in User",
			error: err.message,
		});
	}
};

export const getUsers = async (req: Request, res: Response): Promise<any> => {
	try {
		const users = await get();
		if (!users) return httpResponse.NotFound(res, {message: "Users not found"});
		return httpResponse.Ok(res, {data: users});
	} catch (err: any) {
		return httpResponse.Error(res, {
			message: "Could not get Users",
			error: err.message,
		});
	}
};

export const getUserById = async (
	req: Request,
	res: Response
): Promise<any> => {
	try {
		const {id} = req.params;
		const user = await getById(id);
		if (!user) return httpResponse.NotFound(res, {message: "User not found"});
		return httpResponse.Ok(res, {data: user});
	} catch (err: any) {
		return httpResponse.Error(res, {
			message: "Could not get User by ID",
			error: err.message,
		});
	}
};

export const deleteUserById = async (
	req: Request,
	res: Response
): Promise<any> => {
	try {
		const {id} = req.params;
		const deletedUser = await userModel.findByIdAndDelete(id);
		if (!deletedUser)
			return httpResponse.NotFound(res, {message: "User not found"});
		return httpResponse.Ok(res, {message: "User deleted successfully"});
	} catch (err: any) {
		return httpResponse.Error(res, {
			message: "Could not delete User by ID",
			error: err.message,
		});
	}
};
