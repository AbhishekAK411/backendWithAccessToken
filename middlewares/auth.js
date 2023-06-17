export const checkRegister = (req,res,next) =>{
    try{
        const {username, email, password, confirmPassword} = req.body;
        if(!username) return res.send("Username is required.");
        if(!email) return res.send("Email is required.");
        if(!password) return res.send("Password is required.");
        if(!confirmPassword) return res.send("Confirm Password is required.");
        next();
    }catch(err){
        return res.send(err);
    }
}