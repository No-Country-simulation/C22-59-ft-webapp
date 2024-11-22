import { IUser } from "../../interfaces/user";
import User from "../../models/users/user.model";
import bcrypt from "bcrypt";

export const create = async(user: IUser) => {
  try {
    const createdUser = await User.create(user);
    return createdUser;
  } catch (error: any) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

export const login = async(email: string, password: string) => {
  try {
    const user = await User.findOne({ email });
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
