import { NextFunction,Request,Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { UserRegistrationSchema } from "../utils/validation";
import { ApiError } from "../utils/ApiError";
import { ErrorCode } from "../constants";
import { PrismaClient } from "@prisma/client";
import { ApiResponse } from "../utils/ApiResponse";

const prisma = new PrismaClient();

export const registerUser=asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
      const validatedFields=UserRegistrationSchema.safeParse(req.body);
      if(!validatedFields.success){
            throw new ApiError(400,"Failed validation!",ErrorCode.VALIDATION_FAILED)
      }
      const {email,fullName,phNumber}=validatedFields.data;
      const existingUser = await prisma.user.findFirst({
            where: {
              OR: [
                { email: email },
                { phNumber: phNumber }
              ]
            }
          });
      if(existingUser){
            throw new ApiError(409,"Email exist!",ErrorCode.EMAIL_EXIST)
      }
      const user = await prisma.user.create({
            data:{
                  email,
                  name:fullName,
                  phNumber
            }
      })
      if(!user){
            throw new ApiError(500,"Failed to register!",ErrorCode.DATABASE_ERROR);
      }
      res.status(201).json(new ApiResponse(201,{userId:user.id},"success!"))
})