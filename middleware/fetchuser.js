require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET=process.env.JWT_SECRET;

const fetchuser=(req,res,next)=>{
// console.log("All headers--> ",req.headers);
const authHeader=req.headers['authorization'];
const token=authHeader;
// console.log("token-->",token);

if(!token){
    res.status(401).send({error:"Please authenticate with a valid token"})
}
else {
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
            res.status(401).send({error:"Please authenticate with a valid token"})
        }
        const LinkedinID=payload.LinkedinID;
        req.user=LinkedinID;
        console.log('Linkedinid -->  ',req.user);
        next();
    })
} 

}
module.exports=fetchuser