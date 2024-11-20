import { IUser } from "../../interfaces/user";
import User from "../../models/users/user.model";

export const create = async(user: IUser) => {
  try {
    const createdUser = await User.create(user);
    return createdUser;
  } catch (error: any) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};
