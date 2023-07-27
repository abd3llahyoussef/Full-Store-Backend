import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import prodrouter from "./routes/prod.routes";
import orderrouter from "./routes/order.routes";
import userrouter from "./routes/user.routes";

const app: express.Application = express();
const port: string = "0.0.0.0:8000";

/*const corsOptions = {
  origin: "http://localhost:8000",
  optionsSuccessStatus: 200,
};*/
app.use(bodyParser.json());
app.use(cors());

app.listen(8000, () => {
  console.log(`server work on port:${port}`);
});

prodrouter(app);
orderrouter(app);
userrouter(app);

export default app;
