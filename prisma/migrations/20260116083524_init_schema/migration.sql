-- CreateEnum
CREATE TYPE "OperationType" AS ENUM ('START', 'ADD', 'SUB', 'MUL', 'DIV');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calculation" (
    "id" TEXT NOT NULL,
    "parentId" TEXT,
    "rootId" TEXT,
    "userId" TEXT,
    "operationType" "OperationType" NOT NULL,
    "leftValue" DECIMAL(65,30) NOT NULL,
    "rightValue" DECIMAL(65,30),
    "resultValue" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Calculation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "Calculation_rootId_idx" ON "Calculation"("rootId");

-- CreateIndex
CREATE INDEX "Calculation_userId_idx" ON "Calculation"("userId");

-- AddForeignKey
ALTER TABLE "Calculation" ADD CONSTRAINT "Calculation_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Calculation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calculation" ADD CONSTRAINT "Calculation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
