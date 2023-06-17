import mongoose from "mongoose";
import { Schema } from "mongoose";

const user = new Schema({
    username : String,
    email : String,
    password : String,
    accessToken : {
        type : String,
        unique : true,
        required : true
    }
});

export default mongoose.model("Users", user);