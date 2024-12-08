import { IAdministrator } from "../../interfaces/administrator";
import Administrator from "../../models/administrator/administrator.model";

export const create = async(administrator: IAdministrator) => {
  try {
    const createdAdministrator = await Administrator.create(administrator);
    return createdAdministrator;
  } catch (error: any) {
    throw new Error(`Error creating administrator: ${error.message}`);
  }
};