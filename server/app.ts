import dotenv from 'dotenv';
import express from "express";
import { dbConnect } from './config/dbConnect';
import { startApolloServer } from './apollo/apolloServer';
dotenv.config({ path: "config/.env.local" })

const app = express();
app.use(express.json())

dbConnect();
startApolloServer(app);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

export default app;