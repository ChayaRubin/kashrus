-- CreateTable
CREATE TABLE "Restaurant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "city" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "hechsher" TEXT,
    "website" TEXT,
    "images" TEXT,
    "level" TEXT NOT NULL,
    "category" TEXT,
    "type" TEXT
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "can_self_book" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Password" (
    "userId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "password_hash" TEXT NOT NULL,
    CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Article" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Rabbi" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "area" TEXT
);

-- CreateTable
CREATE TABLE "Hechsher" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "symbolUrl" TEXT
);

-- CreateIndex
CREATE INDEX "Restaurant_category_type_level_idx" ON "Restaurant"("category", "type", "level");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
