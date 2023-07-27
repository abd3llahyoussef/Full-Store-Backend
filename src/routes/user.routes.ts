import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { user, makeorders, Userstore } from "./../models/user";
import dotenv from "dotenv";

dotenv.config();
const { TOKEN_SECRET } = process.env;

const store = new Userstore();

const index = async (_req: Request, res: Response) => {
  try {
    const users = await store.getusers();
    res.json(users);
  } catch (err) {
    res.send(500).send(err);
  }
};

const show = async (req: Request, res: Response) => {
  const user_id = parseInt(req.params.id);
  try {
    const user = await store.getspecificuser(user_id);
    console.log(user);
    res.json(user);
  } catch (err) {
    res.send(500).send(err);
  }
};

const create = async (req: Request, res: Response) => {
  const makeuser: user = {
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password,
  };
  console.log(makeuser);
  try {
    const make = await store.createuser(makeuser);
    res.json(make);
  } catch (err) {
    res.send(500).send(err);
  }
};

const accessForm = async (req: Request, res: Response) => {
  const vuser: user = {
    username: req.body.username,
    password: req.body.password,
  };
  try {
    const verifyUser = await store.authenticate(vuser);
    res.json(verifyUser);
  } catch (err) {
    res.send(500).send(err);
  }
};

const authoriztion = async (req: Request, res: Response, next: Function) => {
  const user: user = req.body.username;
  try {
    const newUser = await store.createuser(user);
    const token = jwt.sign({ user: newUser }, TOKEN_SECRET as string);
    res.json(token);
  } catch (err) {
    res.status(400);
    res.json(`${err}+${user}`);
  }
};

const verifyauth = async (req: Request, res: Response, next: Function) => {
  try {
    const authurizationHeader = req.headers.authorization;
    const check = authurizationHeader ? authurizationHeader.split(" ")[1] : "";
    const token = jwt.verify(check, TOKEN_SECRET as string);
    next();
  } catch (err) {
    res.send(401);
    res.send(err);
  }
};

const completeorder = async (req: Request, res: Response) => {
  const user_id = parseInt(req.params.id);
  const completeorders: makeorders = {
    quantity: req.body.quantity,
    product_id: req.body.product_id,
  };
  try {
    const completeit = await store.addproduct(user_id, completeorders);
    res.json(completeit);
  } catch (err) {
    res.send(400);
    res.send(err);
  }
};

const userrouter = (app: express.Application) => {
  app.get("/getusers", verifyauth, index);
  app.get("/getauser/:id", verifyauth, show);
  app.post("/verifyuser", accessForm);
  app.post("/makeuser", create);
  app.get("/completeorder", verifyauth, completeorder);
};

export default userrouter;
