/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";
import path from "path";

import multer from "multer";

// const requestIp = require('request-ip')
const app: Application = express();

// app.use(requestIp.mw());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));


// app.use(
//   cors({
//     origin: "*",
//   })
// );


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://accountingsoft.netlify.app",
    ],
    credentials: true,
  })
);


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/transactions");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1000)}`;
    const fileExtension = path.extname(file.originalname);
    cb(null, `transaction-${uniqueSuffix}${fileExtension}`);
  },
});


export const upload = multer({ storage });


// application routes
app.use("/api", router);

const test = async (req: Request, res: Response) => {
  return res.json({ message: "working nicely" });
};

app.get("/", test);

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
