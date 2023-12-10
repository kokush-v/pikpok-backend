import { User } from "./requests";

export interface Status {
	status: string | number;
	message?: string;
}

export interface UserRegistrationResponse extends Status {
	data: User | any;
}

export interface FileUploadResponse extends Status {
	data:
		| {
				fileUrl: string;
		  }
		| any;
}

export interface SubscribeResponse extends Status {
	data:
		| {
				success: string;
		  }
		| any;
}
