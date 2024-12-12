import {IUser} from "@interfaces/user";
import User from "@models/users/user.model";
import bcrypt from "bcrypt";

export const create = async (user: IUser) => {
	try {
		const createdUser = await User.create(user);
		return createdUser;
	} catch (error: any) {
		throw new Error(`Error creating user: ${error.message}`);
	}
};

export const login = async (email: string, password: string) => {
	try {
		const user = await User.findOne({email});
		if (!user) {
			throw new Error("Invalid email or password");
		}
		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordMatch) {
			throw new Error("Invalid email or password");
		}
		return user;
	} catch (error: any) {
		throw new Error(`Error logging in: ${error.message}`);
	}
};

export const get = async () => {
	try {
		const usersData = await User.find();
		return usersData;
	} catch (error: any) {
		throw new Error(`Error getting users: ${error.message}`);
	}
};
export const existByEmail = async (email: String): Promise<boolean> => {
	try {
		return !!(await User.findOne({email}));
	} catch (error: any) {
		throw new Error(`Error getting users: ${error.message}`);
	}
};
export const getById = async (id: string) => {
	try {
		const usersData = await User.findById(id);
		if (!usersData) {
			throw new Error("User not found");
		}
		return usersData;
	} catch (error: any) {
		throw new Error(`Error getting user by id: ${error.message}`);
	}
};

export const deleteById = async (id: string) => {
	try {
		await User.findByIdAndDelete(id);
		return {message: "User deleted successfully"};
	} catch (error: any) {
		throw new Error(`Error deleting user by id: ${error.message}`);
	}
};
