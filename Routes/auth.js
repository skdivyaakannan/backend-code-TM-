import express from 'express';
import bcrypt from 'bcryptjs';
import UserCollection from '../Models/Usermodel.js';
import jwt from 'jsonwebtoken';
import Joi from 'joi';


const User = Joi.object().keys({
  email: Joi.string().email().required(),
  password:Joi.string().min(3).max(5).required(),
 })


const validate = (schema) => (req, res, next) => {
  const {error} = schema.validate(req.body);  //intha schema.validate is a func in joi which helps in checking validations of input 
  if (error) {
    res.status(422).send(error.details);
  } else {
    next();
  }
};



const AuthRouter = express.Router()
//user login api 

AuthRouter.post('/login',validate(User),async(req,res)=>{

try {
  let {email ,password}= req.body

    let user = await UserCollection.findOne({email : email});
    
    
  if(!user){
    return res.status(422).send("email not found")
  }
  const checkpass = await bcrypt.compare(password , user.password);
 
  if(!checkpass){
    return res.send("password not valid")
  }
  const token = jwt.sign({
    _id :user._id,
    name:user.name
  },"accesskey")

  console.log(token,"accesskeyref");

  res.cookie("accesstoken",token,{
    httpOnly:true,
    path:'/',
    maxAge:8640000,
  })
} catch (error) {
    return res.status(500).send(error); 
}

  //   let {email ,password}= req.body

  //   let user = await UserCollection.findOne({email : email});
    
    
  // if(!user){
  //   return res.status(422).send("email not found")
  // }
  // const checkpass = await bcrypt.compare(password , user.password);
 
  // if(!checkpass){
  //   return res.send("password not valid")
  // }
 

 
  res.send("user logged in sucessfully")
})


export default AuthRouter;