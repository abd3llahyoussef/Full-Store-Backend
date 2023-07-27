import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { prod, Product } from "../models/product";

dotenv.config();
const { TOKEN_SECRET } = process.env;

const product = new Product();

const index = async (_req: Request, res: Response) => {
  try {
    const geting = await product.getproduct();
    res.json(geting);
  } catch (err) {
    res.send(500).send(err);
  }
};
const show = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const showing = await product.showproduct(id);
    res.json(showing);
  } catch (err) {
    res.send(500).send(err);
  }
};

const prodrouter = (app: express.Application) => {
  app.get("/prod", index);
  app.get("/prod/:id", show);
};

export default prodrouter;
