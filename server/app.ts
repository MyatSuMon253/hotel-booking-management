import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { startApolloServer } from "./apollo/apolloServer";
import { dbConnect } from "./config/dbConnect";

dotenv.config({ path: "config/.env.local" });

const app = express();
app.use(
  express.json({
    verify: (req: Request, res: Response, buf: Buffer) => {
      req.rawBody = buf.toString();
    },
  }),
);
app.use(cookieParser());

dbConnect();
startApolloServer(app);

export default app;
