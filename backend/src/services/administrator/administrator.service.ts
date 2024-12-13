import { IAdministrator } from "../../interfaces/administrator";
import Administrator from "../../models/administrator/administrator.model";
import bcryptjs from "bcryptjs";

export const create = async (administrator: IAdministrator) => {
	try {
		const createdAdministrator = await Administrator.create(administrator);
		return createdAdministrator;
	} catch (error: any) {
		throw new Error(`Error creating administrator: ${error.message}`);
	}
};
export const existByEmail = async (email: string): Promise<boolean> => {
	try {
		return !!(await Administrator.findOne({email}));
	} catch (error: any) {
		throw new Error("Internal Server Error");
	}
};

export const login = async (email: string, password: string) => {
	try {
		const user = await Administrator.findOne({email});
		if (!user)
			throw new Error("Invalid email or password");
		
		const isPasswordMatch = await bcryptjs.compare(password, user.password);
		if (!isPasswordMatch)
			throw new Error("Invalid email or password");
		
		return user;
	} catch (error: any) {
		throw new Error(`Error logging in: ${error.message}`);
	}
};
