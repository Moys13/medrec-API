import express from "express";
import pasienRoute from "./routes/patient.routes";
import authRouter from "./routes/auth.routes";
import outpatientRouter from "./routes/outpatient.routes";
import verifyJWT from "./middleware/verifyJWT.middleware";
import cors from "cors";
import cookieParser from "cookie-parser";
import { disconnectPrisma } from "./utils/prisma";

const app = express();
const port = 3001;
const host = process.env.HOST!;

process.on("SIGINT", async () => {
  await disconnectPrisma();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await disconnectPrisma();
  process.exit(0);
});

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/pasien", verifyJWT, pasienRoute);
app.use("/api/rawat-jalan", verifyJWT, outpatientRouter);

app.listen(port, host, () => {
  console.log(`Server berjalan di http://${host}:${port}`);
});
