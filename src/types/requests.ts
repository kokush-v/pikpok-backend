export interface User {
	firstName: string;
	lastName: string;
	birth: Date;
	phoneNumber: string;
	creditCardNumber: string;
	userType: string;
}

export interface UserRegistration extends User {
	email: string;
	password: string;
}
