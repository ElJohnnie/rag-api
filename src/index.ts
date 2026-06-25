import express from "express";
import { config } from "./config.ts";

const app = express();
app.use(express.json());

app.get("/", (__, res) => {
  res.send("Hello, World!");
});

const PORT = config.server.port;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});