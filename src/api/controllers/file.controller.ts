import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { firebaseConfig } from "../../configs/firebase.config";
import { UserFile } from "../../types/requests";
import { PrismaClient } from "@prisma/client";

initializeApp(firebaseConfig);
const prisma = new PrismaClient();
const storage = getStorage();

export const videoUpload = async ({ user, file }: UserFile): Promise<string> => {
	const dateTime = new Date();

	if (!file || file.mimetype.split("/")[0] !== "video" || !user)
		throw Error("Something went wrong");

	const storageRef = ref(storage, `videos/${user.username}/${file.originalname}-${dateTime}`);

	const metadata = {
		contentType: file.mimetype,
	};

	const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);

	const downloadURL = await getDownloadURL(snapshot.ref);

	const dbResponse = await prisma.videoModel.create({
		data: {
			downloadUrl: downloadURL,
			name: file.originalname,
			uploadDate: dateTime,
			userId: user.id,
		},
	});

	return dbResponse.downloadUrl;
};

export const avatarUpload = async ({ user, file }: UserFile): Promise<string> => {
	const dateTime = new Date();

	if (!file || file.mimetype.split("/")[0] !== "image" || !user)
		throw Error("Something went wrong");

	const storageRef = ref(storage, `avatars/${user.username}-${file.originalname}-${dateTime}`);

	const metadata = {
		contentType: file.mimetype,
	};

	const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);

	const downloadURL = await getDownloadURL(snapshot.ref);

	const dbResponse = await prisma.avatarModel.create({
		data: {
			downloadUrl: downloadURL,
			uploadDate: dateTime,
			userId: user.id,
		},
	});

	return dbResponse.downloadUrl;
};
