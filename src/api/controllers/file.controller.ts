import { initializeApp } from "firebase/app";
import {
	deleteObject,
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { firebaseConfig } from "../../configs/firebase.config";
import { UserFile } from "../../types/requests";
import { PrismaClient } from "@prisma/client";
import { findUserById } from "./user.controller";
import { convertToReadableDate } from "../../common";

initializeApp(firebaseConfig);
const prisma = new PrismaClient();
const storage = getStorage();

export const videoUpload = async ({ user, file }: UserFile): Promise<string> => {
	const dateTime = new Date();

	if (!file || file.mimetype.split("/")[0] !== "video" || !user)
		throw Error("Something went wrong");

	const fileName = `${user.username}-${file.originalname}-${convertToReadableDate(
		dateTime
	)}`.replaceAll("/", "-");

	const storageRef = ref(storage, `videos/${user.id}/${fileName}`);

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

	const getUser = await findUserById(user.id);

	if (!getUser) throw Error("No user");

	if (
		getUser.avatarUrl !==
		"https://firebasestorage.googleapis.com/v0/b/pikpok-7e43d.appspot.com/o/avatars%2Fdefault-avatar.jpeg?alt=media&token=16fe35e9-f2b7-4306-ac55-5f3131c33ca6"
	) {
		const path = decodeURIComponent(getUser.avatarUrl).split("?")[0].split("/avatars/")[1];
		const deleteRef = ref(storage, `avatars/${path}`);
		try {
			await deleteObject(deleteRef);
			await prisma.avatarModel.delete({
				where: {
					downloadUrl: getUser.avatarUrl,
				},
			});
		} catch (error: any) {
			console.log("File doesnt exist");
		}
	}

	const fileName = `${user.username}-${file.originalname}-${convertToReadableDate(
		dateTime
	)}`.replaceAll("/", "-");

	const storageRef = ref(storage, `avatars/${fileName}`);

	const metadata = {
		contentType: file.mimetype,
	};

	const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);

	const downloadURL = await getDownloadURL(snapshot.ref);

	await prisma.userModel.update({
		where: {
			id: user.id,
		},
		data: {
			avatarUrl: downloadURL,
		},
	});

	const dbResponse = await prisma.avatarModel.create({
		data: {
			downloadUrl: downloadURL,
			uploadDate: dateTime,
			userId: user.id,
		},
	});

	return dbResponse.downloadUrl;
};
