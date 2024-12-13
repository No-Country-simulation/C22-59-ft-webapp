export class ErrorAppointment extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ErrorAppointment";
	}
}