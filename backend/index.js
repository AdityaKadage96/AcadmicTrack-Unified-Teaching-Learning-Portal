// import express from "express"
// import dotenv from "dotenv"
// import connectDb from "./configs/db.js"
// import authRouter from "./routes/authRoute.js"
// import cookieParser from "cookie-parser"
// import cors from "cors"
// import userRouter from "./routes/userRoute.js"
// import courseRouter from "./routes/courseRoute.js"
// //import paymentRouter from "./routes/paymentRoute.js"
// import aiRouter from "./routes/aiRoute.js"
// import reviewRouter from "./routes/reviewRoute.js"

// //import aiRoutes from "./routes/aiRoute.js"
// import quizRoute from "./routes/quizeRoute.js";
// import paymentRoute from "./routes/paymentRoute.js";


// dotenv.config()

// let port = process.env.PORT
// let app = express()
// app.use(express.json())
// app.use(cookieParser())
// app.use(cors({
//     origin:"http://localhost:5173",
//     credentials:true
// }))
// app.use("/api/auth", authRouter)
// app.use("/api/user", userRouter)
// app.use("/api/course", courseRouter)
// //app.use("/api/payment", paymentRouter)
// app.use("/api/ai", aiRouter)
// app.use("/api/review", reviewRouter)
// //app.use("/api/quiz", aiRoutes);
// app.use("/api/quiz", quizRoute);
// app.use("/api/payment", paymentRoute);





// app.get("/" , (req,res)=>{
//     res.send("Hello From Server")
// })

// app.listen(port , ()=>{
//     console.log("Server Started")
//     connectDb()
// })


//--------------------------------------------------version 2---------------------------

import express from "express";
import dotenv from "dotenv";
import connectDb from "./configs/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// Routes
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import courseRouter from "./routes/courseRoute.js";
//import aiRouter from "./routes/aiRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
import quizRoute from "./routes/quizRoute.js";
import paymentRoute from "./routes/paymentRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
//app.use("/api/ai", aiRouter);
app.use("/api/review", reviewRouter);
app.use("/api/quiz", quizRoute);
app.use("/api/payment", paymentRoute);

// Health check
app.get("/", (req, res) => {
    res.send("Server Running ✅");
});

// Start server AFTER DB connection
app.listen(port, async () => {
    console.log("Server Started 🚀");
    await connectDb();
});

