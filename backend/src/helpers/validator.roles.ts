import {existByEmail as existByEmailAdministrator} from "@services/administrator/administrator.service";
import {existByEmail as existByEmailUser} from "@services/user/user.service";
import {existByEmail as existByEmailDoctor} from "@services/doctor/doctor.service";
export const emailExists = async (email: string) => {
	return (
		(await existByEmailAdministrator(email)) ||
		(await existByEmailUser(email)) ||
		(await existByEmailDoctor(email))
	);
};
