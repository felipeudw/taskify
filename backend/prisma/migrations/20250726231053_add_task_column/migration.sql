/*
  Warnings:

  - Added the required column `column` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "column" TEXT NOT NULL;
