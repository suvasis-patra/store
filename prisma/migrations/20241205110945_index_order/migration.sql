-- CreateIndex
CREATE INDEX "Order_productId_buyerId_idx" ON "Order"("productId", "buyerId");

-- CreateIndex
CREATE INDEX "Order_buyerId_idx" ON "Order"("buyerId");

-- CreateIndex
CREATE INDEX "Order_productId_idx" ON "Order"("productId");
