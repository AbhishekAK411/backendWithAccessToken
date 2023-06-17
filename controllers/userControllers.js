import Users from "../models/users.js";
import encrypt from "encryptjs";

export const register = async(req,res) =>{
    try{
        const {username, email, password, confirmPassword} = req.body;
        const user = await Users.find({email}).exec();
        if(user.length) return res.send("User is already registered.");

        if(password.length < 8 && confirmPassword.length < 8){
            return res.send("Length of the password should be more than 8 characters.");
        }
        if(password !== confirmPassword){
            return res.send("Passwords do not match.");
        }

        //password encryption
        let secretKeyPass = "secretKeyPass";
        const encryptPass = encrypt.encrypt(password, secretKeyPass, 256);

        //generate a random string and save as access token
        let random = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charLength = characters.length;
        let length = 100;
        for(let i=0;i<length;i++){
            random += characters.charAt(Math.floor(Math.random() * charLength));
        }

        //save user registration details to mongoDB
        const newUser = new Users({
            username,
            email,
            password : encryptPass,
            accessToken : random
        });
        await newUser.save();
        return res.send("User registered successfully.");
    }catch(err){
        return res.send(err);
    }
}