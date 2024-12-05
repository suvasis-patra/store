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

export const getUserById=asyncHandler(async(req:Request,res:Response)=>{
      const {userId}=req.params;
      if(!userId){
            throw new ApiError(401,"Unauthorized!",ErrorCode.UNAUTHORIZED_ACCESS);
      }
      const user = await prisma.user.findUnique({where:{id:Number(userId)}});
      if(!user){
            throw new ApiError(404,"User not found!",ErrorCode.USER_NOT_FOUND);
      }
      res.status(200).json(new ApiResponse(200,user,"success!"))
})


export const getOrdersByUser=asyncHandler(async(req:Request,res:Response)=>{
      const {userId}=req.params;
      if(!userId){
            throw new ApiError(401,"Unauthorized!",ErrorCode.UNAUTHORIZED_ACCESS);
      }
      const userOrders = await prisma.user.findUnique({
            where:{id:Number(userId)},
            select:{
                  orders:true
            }
      });
      if(!userOrders){
            throw new ApiError(404,"User not found!",ErrorCode.USER_NOT_FOUND);
      }
      res.status(200).json(new ApiResponse(200,{orders:userOrders.orders},"success!"))
})


export const updateUser=asyncHandler(async(req:Request,res:Response)=>{
      const {userId}=req.params;
      if(!userId){
            throw new ApiError(401,"Unauthorized!",ErrorCode.USER_NOT_FOUND)
      }
      const validateFields=UserRegistrationSchema.partial().safeParse(req.body);
      if(!validateFields.success){
            throw new ApiError(400,"Validation Failed",ErrorCode.VALIDATION_FAILED);
      }
      const {email,fullName,phNumber}=validateFields.data;
      const user = await prisma.user.update({
            where:{id:parseInt(userId)},
            data:{
                  ...(email && {email}),
                  ...(fullName && {name:fullName}),
                  ...(phNumber && {phNumber})
            }
      })
      if(!user){
            throw new ApiError(400,"Failed to update user!",ErrorCode.USER_NOT_FOUND)
      }
      res.status(200).json(new ApiResponse(200,{userId:user.id},"success!"))
})

export const getUserByProduct=asyncHandler(async(req:Request,res:Response)=>{
      const {productId}=req.params;
      if(!productId){
            throw new ApiError(400,"Product not found!",ErrorCode.PRODUCT_NOT_FOUND)
      }
      const id =parseInt(productId)
      const users = await prisma.user.findMany({
            where:{
                  orders:{
                        some:{id},
                  }
            }
      })

      if(!users){
            throw new ApiError(400,"Failed to find users!",ErrorCode.USER_NOT_FOUND)
      }
      res.status(200).json(new ApiResponse(200,users,"success"))
})