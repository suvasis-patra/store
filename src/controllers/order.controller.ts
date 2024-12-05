import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { OrderCreationSchema } from "../utils/validation";
import { ApiError } from "../utils/ApiError";
import { ErrorCode } from "../constants";
import { PrismaClient } from "@prisma/client";
import { ApiResponse } from "../utils/ApiResponse";

const prisma = new PrismaClient();

export const placeOrder = asyncHandler(async (req: Request, res: Response) => {
  const validatedFields = OrderCreationSchema.safeParse(req.body);
  if (!validatedFields.success) {
    throw new ApiError(400, "Failed validation!", ErrorCode.VALIDATION_FAILED);
  }

  const { buyerId, productId, odrQuantity, orderValue } = validatedFields.data;

  try {
    const order = await prisma.$transaction(async (tx) => {
      const checkBuyer = await tx.user.findUnique({ where: { id: buyerId } });
      if (!checkBuyer) {
        throw new ApiError(400, "Buyer not found!", ErrorCode.USER_NOT_FOUND);
      }

      const checkProduct = await tx.product.findUnique({ where: { id: productId } });
      if (!checkProduct) {
        throw new ApiError(400, "Product not found!", ErrorCode.PRODUCT_NOT_FOUND);
      }

      if (checkProduct.stkQuantity < odrQuantity) {
        throw new ApiError(400, "Insufficient stock!", ErrorCode.RESOURCE_NOT_FOUND);
      }

      const createdOrder = await tx.order.create({
        data: {
          buyerId,
          productId,
          orderValue,
          odrQuantity,
        },
      });

      await tx.product.update({
        where: { id: productId },
        data: {
          stkQuantity: checkProduct.stkQuantity - odrQuantity,
        },
      });

      return createdOrder;
    });

    
    res.status(201).json(new ApiResponse(201, order, "Order created successfully!"));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(new ApiError(error.statusCode,error.message,error.errorCode));
    } else {
      res.status(500).json(new ApiError(500,"Internal server error!",ErrorCode.INTERNAL_SERVER_ERROR));
    }
  } finally {
    await prisma.$disconnect();
  }
});

export const getOrderById=asyncHandler(async(req:Request,res:Response)=>{
      const {orderId}=req.params;
      if(!orderId){
            throw new ApiError(400,"Not Found!",ErrorCode.RESOURCE_NOT_FOUND);
      }
      const order=await prisma.order.findUnique({
            where:{id:Number(orderId)}
      })
      if(!order){
            throw new ApiError(400,"Not Found!",ErrorCode.ORDER_NOT_FOUND)
      }
      res.status(200).json(new ApiResponse(200,order,"success!"))
})

export const getRecentOrders=asyncHandler(async(_:Request,res:Response)=>{
      const now = new Date()
      const aWeek=new Date()
      aWeek.setDate(now.getDate()-7);
      const orders=await prisma.order.findMany({
            where:{
                  createdAt:{
                        gte:aWeek,
                  }
            },
            include:{
                  buyer:true,
                  product:true
            },
            orderBy:{
                  createdAt:"desc"
            }
      })
      if(orders.length<=0){
            throw new ApiError(400,"Failed to ge Orders!",ErrorCode.ORDER_NOT_FOUND)
      }
      res.status(200).json(new ApiResponse(200,orders,"success!"))
})


export const updateOrder=asyncHandler(async(req:Request,res:Response)=>{
  const {orderId}=req.params;
  if(!orderId){
    throw new ApiError(400,"Order not found!",ErrorCode.ORDER_NOT_FOUND);
  }
  const validatedFields = OrderCreationSchema.partial().safeParse(req.body);
  if(!validatedFields.success){
    throw new ApiError(400,"Validation Error!",ErrorCode.VALIDATION_FAILED);
  }
  const {buyerId,odrQuantity,orderValue,productId}=validatedFields.data;
  const checkBuyer = await prisma.user.findUnique({ where: { id: buyerId } });
      if (!checkBuyer) {
        throw new ApiError(400, "Buyer not found!", ErrorCode.USER_NOT_FOUND);
      }

      const checkProduct = await prisma.product.findUnique({ where: { id: productId } });
      if (!checkProduct) {
        throw new ApiError(400, "Product not found!", ErrorCode.PRODUCT_NOT_FOUND);
      }

      if (odrQuantity && checkProduct.stkQuantity < odrQuantity) {
        throw new ApiError(400, "Insufficient stock!", ErrorCode.RESOURCE_NOT_FOUND);
      }
  const updatedOrder = await prisma.order.update({
    where:{id:parseInt(orderId)},
    data:{
      ...(odrQuantity && {odrQuantity}),
      ...(orderValue && {orderValue}),
      ...(productId && {productId}),
      ...(buyerId && {buyerId})
    }
  })
  if(!updatedOrder){
    throw new ApiError(500,"Failed to update order!",ErrorCode.DATABASE_ERROR)
  }
  res.status(200).json(new ApiResponse(200,{orderId:updatedOrder.id},"success!"))
})


