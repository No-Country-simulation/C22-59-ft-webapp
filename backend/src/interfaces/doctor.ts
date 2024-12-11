export interface IDoctor {
	birthday?: string;
	name: string;
	surname: string;
	nationalId: string;
	email: string;
	password: string;
	telephone: string;
	optionalTelephone?: string;
	blood?: string;
	gender?: string;
	specialty: string;
	licenseNumber: string;
	workingHours?: {
		start: string;
		end: string;
		daysOff: string[];
	};
	appointments?: any[];
}
