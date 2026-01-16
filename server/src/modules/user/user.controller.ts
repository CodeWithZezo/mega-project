import { Request, Response } from "express";
import { User } from "../../models/schema/user.schema";

export class userController { 
     static async signup(req:Request,res:Response){
          try{
            const {fullName,email,password,phone} = req.body;
            const exsistingEmail = await User.findOne({email});
            if(exsistingEmail){
                return res.status(400).json({message:"Email already exists"});
            }
            
            const user = await User.create({fullName,email,passwordHash:password,phone});
            return res.status(201).json({message:"User created successfully",user});
          }catch(error){
            
          }   
     }

}