import express, { Request, Response } from "express";

import cors from "cors";
import { getUser } from "./user";
import { getSales, Sales } from "./sales";

const app = express();
const port = 8080;

app.use(cors());
app.get("/user", getUser);

app.get("/sales", async (req, res) => {
  /** Write an api for the widget */
  console.log("Got sales request");

  const sales: Sales = await getSales();

  console.log("Sales request result:", sales);

  res.json(sales);
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
