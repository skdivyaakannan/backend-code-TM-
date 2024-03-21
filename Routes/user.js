import express from 'express';

import bcrypt from 'bcryptjs';
import UserCollection from '../Models/Usermodel.js';
import jwt from 'jsonwebtoken'
import Joi from 'joi'

const UserRouter = express.Router();

 const User = Joi.object().keys({
  username : Joi.string().min(2).max(10).required(),
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

//user register api 

UserRouter.post('/register',validate(User),async (req,res)=>{

  try {
    let {username, email, password} = req.body;

  let user = await UserCollection.findOne({email: email});
  if(user){
    return res.send("email already exist")

  }
  const salt  = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password,salt);
  let newuser = new UserCollection({
    username: username,
    email: email,
    password: hashedPassword
  })


  const result = await newuser.save();
  console.log(result,"result")

  const token = jwt.sign({
    _id: result._id,
    name:result.name
  },"refkey")
  console.log(token,"tokenref ")
  res.cookie("refreshtoken", token,{
    httpOnly:true,
    path:'/',
    maxAge:8640000,
  })


  if(result){
    return res.status(201).send(result)
  }
  } catch (error) {
    return res.status(500).send(error); 
  }
  // let {username, email, password} = req.body;

  // let user = await UserCollection.findOne({email: email});
  // if(user){
  //   return res.send("email already exist")

  // }



})

export default UserRouter;