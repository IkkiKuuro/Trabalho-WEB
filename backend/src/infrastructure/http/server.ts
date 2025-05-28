import express, { Request, Response, NextFunction, Application } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

const app: Application = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3000;