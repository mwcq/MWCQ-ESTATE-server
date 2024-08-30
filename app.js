import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import postRouter from "./routes/post.route.js";
import authRouter from "./routes/auth.route.js";
import testRouter from "./routes/test.route.js";
import userRouter from "./routes/user.route.js";
import chatRouter from "./routes/chat.route.js";
import messageRouter from "./routes/message.route.js";

const exp = express();

exp.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

exp.use(express.json()); // 解析json格式的请求体

exp.use(cookieParser()); // 解析cookie

exp.use("/api/posts", postRouter);

exp.use("/api/auth", authRouter);

exp.use("/api/test", testRouter);

exp.use("/api/users", userRouter);

exp.use("/api/chats", chatRouter);

exp.use("/api/message", messageRouter);

exp.listen(8080, () => {
  console.log("服务开启，端口8080");
});
