import axios from "axios";
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
        setTimeout(async () => {
            await Users.updateOne({email}, {$unset : {accessToken : 1}});
        }, 4 * 60 * 60 * 1000);
        return res.send("User registered successfully.");
    }catch(err){
        return res.send(err);
    }
}

export const regenToken = async (req,res) =>{
    try{
        const {email, password} = req.body;
        const user = await Users.find({email}).exec();
        
        let regenToken = "";
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let charLength = characters.length;
        let length = 100;

        for(let i=0;i<length;i++){
            regenToken += characters.charAt(Math.floor(Math.random() * charLength));
        }

        if(!user[0].accessToken){
            await Users.findOneAndUpdate({email}, {accessToken : regenToken}).exec();
            setTimeout(async ()=>{
                await Users.updateOne({email}, {$unset : {accessToken : 1}});
            }, 4 * 60 * 60 * 1000);
        }else{
            return res.send("Access token already generated.");
        }
    }catch(err){
        return res.send(err);
    }
}

export const getMovies = async (req,res) =>{
    try{
        const { videoName, email } = req.body;
        if(!videoName) return res.send("Name of the video is required.")

        const user = await Users.find({email}).exec();
        if(!user.length) return res.send("User not found.")
        if(user[0].accessToken){
            let apiKey = "k_enh8ygao";
            const response = await axios.get(`https://imdb-api.com/en/API/YouTubeTrailer/${apiKey}/${videoName}`);
            return res.send(response.data.videoUrl);
        }else{
            return res.send("Kindly generate access token.");
        }
    }catch(err){
        return res.send(err);
    }
}