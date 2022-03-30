import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import firebaseConfig from "../../../config/firebase_config.js";
import mongoose from "mongoose";
import {randomUUID} from 'crypto';
import Sharp from "sharp";

class Database {
  #connectStatus = false;
  #firebaseApp;
  #storage;
  async connect() {
    if (this.#connectStatus) {
      return;
    }
    try {
      await mongoose.connect(
        `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@thisisfortestpurpose.3mdrb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
        { useNewUrlParser: true }
      );
      console.log("Database connected");
      this.#firebaseApp = initializeApp(firebaseConfig);
      this.#storage = getStorage(this.#firebaseApp);
      this.#connectStatus = true;
    } catch (e) {
      console.log(e);
      throw Error("Failed to connect to database");
    }
  }

  async upLoadImg(file) {
    // file<File>: image file to upload
    // return firebase path and file download url
    const fileExt = 'jpeg';
    const firebasePath = `/images/${randomUUID() + "." + fileExt}`;
    const storageRef = ref(this.#storage, firebasePath);
    const metadata = {
      contentType: 'image/jpeg',
    };
    const data = await Sharp(file.buffer).jpeg({quality: 50, force: true}).toBuffer();
    const result = await uploadBytes(storageRef, data, metadata);
    const url = await getDownloadURL(result.ref);
    return {
      firebasePath: firebasePath,
      firebaseUrl: url,
    };
  }

  async deleteImg(firebasePath) {
    // firebasePath<String>: path to file in firebase
    const fileRef = ref(this.#storage, firebasePath);
    try{
        await deleteObject(fileRef);
    }
    catch(e){
        console.log(e);
    }
  }
}

export default Database;
