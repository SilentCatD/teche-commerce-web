import mongoose from "mongoose";

const roleScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const Role = mongoose.model("Role",roleScheme);

export default Role;
