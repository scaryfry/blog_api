import express from "express";
import cors from "cors";
import postRoutes from "./routers/postRoutes.js";
import userRoutes from "./routers/userRoutes.js";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/posts", postRoutes);
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server runs on : ${PORT}`);
});
