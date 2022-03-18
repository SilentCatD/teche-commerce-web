import mongoose from "mongoose";
const imageSchema = new mongoose.Schema({
    firebasePath: {
        type: String, 
        required: true,
    },
    firebaseUrl: {
        type: String,
        required: true,
    },
});

const Image = mongoose.model('Image',imageSchema);

export {Image, imageSchema};
