import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "../../configs/firebase.config";

initializeApp(firebaseConfig);

const storage = getStorage();

export const videoUpload = async (file: Express.Multer.File | undefined) => {};
