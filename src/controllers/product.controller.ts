import { asyncHandler } from "../utils/asyncHandler";
import {Request,Response} from "express"
import { ProductCreationSchema } from "../utils/validation";
import { ApiError } from "../utils/ApiError";
import { ErrorCode } from "../constants";
import { PrismaClient } from "@prisma/client";
import { ApiResponse } from "../utils/ApiResponse";

const prisma=new PrismaClient();

export const createProduct=asyncHandler(async(req:Request,res:Response)=>{
      const validatedFields=ProductCreationSchema.safeParse(req.body);
      if(!validatedFields.success){
            throw new ApiError(400,"Failed validation!",ErrorCode.VALIDATION_FAILED)
      }
      const {name,price,description,stkQuantity}=validatedFields.data;
      const product = await prisma.product.create(
            {
                  data:{
                        name,
                        price,
                        description,
                        stkQuantity
                  }
            }
      )
      if(!product){
            throw new ApiError(500,"Failed to create product!",ErrorCode.DATABASE_ERROR)
      }
      res.status(201).json(new ApiResponse(201,{productId:product.id},"success!"))
})

export const getProductById=asyncHandler(async(req:Request,res:Response)=>{
      const {productId}=req.params;
      if(!productId){
            throw new ApiError(401,"Product not found!",ErrorCode.PRODUCT_NOT_FOUND);
      }
      const product = await prisma.product.findUnique({where:{id:Number(productId)}});
      if(!product){
            throw new ApiError(404,"Product not found!",ErrorCode.PRODUCT_NOT_FOUND);
      }
      res.status(200).json(new ApiResponse(200,product,"success!"))
})

export const getTotalProductQuantity=asyncHandler(async(_:Request,res:Response)=>{
      const totalProductQuantity=await prisma.product.aggregate({
            _sum:{
                  stkQuantity:true
            }
      })
      res.status(200).json(new ApiResponse(200,{totalProductsQuantity:totalProductQuantity._sum.stkQuantity||0},"success!"))
})


export const updateProduct=asyncHandler(async(req:Request,res:Response)=>{
      const {productId}=req.params;
      if(!productId){
            throw new ApiError(400,"Product not found!",ErrorCode.PRODUCT_NOT_FOUND);
      }
      const validatedFields = ProductCreationSchema.partial().safeParse(req.body);
      if(!validatedFields.success){
            throw new ApiError(400,"Validation Error!",ErrorCode.VALIDATION_FAILED);
      }
      const { name, price, description, stkQuantity } = validatedFields.data;
      const updatedProduct = await prisma.product.update({
            where:{id:parseInt(productId)},
            data:{
                  ...(name && {name}),
                  ...(description && {description}),
                  ...(stkQuantity && {stkQuantity}),
                  ...(price && {price}),
            }
      })
      if(!updatedProduct){
            throw new ApiError(500,"Failed to update product",ErrorCode.DATABASE_ERROR)
      }
      res.status(200).json(new ApiResponse(200,{productId:updatedProduct.id},"success!"))
})
