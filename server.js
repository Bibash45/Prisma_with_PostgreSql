import "dotenv/config";
import express from "express";
import prisma from "./DB/db.config.js";

const app = express();


const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get("/", (req, res) => {
  res.send(
    `<a href="http://localhost:${PORT}">http://localhost:${PORT}</a> is running`
  );
});

// routes file
import routes from "./routes/index.js";
app.use(routes);

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("1. Database connected successfully!");

    app.listen(PORT, () => {
      console.log(`2. Server is running on PORT ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

startServer();
