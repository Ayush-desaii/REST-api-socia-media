import express from "express";
import mongoose from "mongoose";
import router from "./routes/user-routes.js";
import blogRouter from "./routes/blog-routes.js";

const app = express();
app.use(express.json());
app.use("/api/user", router);
app.use("/api/blog", blogRouter);

mongoose
     .connect(
        "mongodb+srv://ayushdesaico21d2:9x3FDqHgIEqhSUFJ@cluster0.rwsa7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    ).then(()=>app.listen(5000))
     .then(
        ()=>console.log("connected to database and listning"))
     .catch((err)=>console.log(err));

//9x3FDqHgIEqhSUFJ