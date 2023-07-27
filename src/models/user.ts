import client from "../database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();
const { PEPPER, SALT_ROUNDS } = process.env;

export type user = {
  id?: number;
  username: string;
  firstname?: string;
  lastname?: string;
  password: string;
};

export type makeorders = {
  id?: number;
  quantity: number;
  order_id?: number;
  product_id: number;
};

export class Userstore {
  async getusers(): Promise<user> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM users";
      const results = await conn.query(sql);
      const res = results.rows[0];
      conn.release();
      return res;
    } catch (err) {
      throw new Error("there are no users");
    }
  }

  async getspecificuser(user_id: number): Promise<user> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM users WHERE id = $1";
      const results = await conn.query(sql, [user_id]);
      const res = results.rows[0];
      console.log(res);
      conn.release();
      return res;
    } catch (err) {
      throw new Error("there are no users");
    }
  }

  async createuser(user: user): Promise<user> {
    try {
      const conn = await client.connect();
      const sql =
        "INSERT INTO users (username,firstname,lastname,password) VALUES ($1,$2,$3,$4)";
      const hash = bcrypt.hashSync(
        user.password + (PEPPER as string),
        parseInt(SALT_ROUNDS as string)
      );
      const results = await conn.query(sql, [
        user.username,
        user.firstname,
        user.lastname,
        hash,
      ]);
      const res = results.rows[0];
      conn.release();
      return res;
    } catch (err) {
      throw new Error("can not create any users");
    }
  }

  async authenticate(vuser: user): Promise<user | null> {
    console.log(vuser);
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM users WHERE username = $1";
      const results = await conn.query(sql, [vuser.username]);
      if (results.rows.length) {
        const user = results.rows[0];
        if (bcrypt.compareSync(vuser.password + PEPPER, user.password)) {
          return user.username;
        }
      }
      return null;
    } catch (err) {
      throw new Error("you are not authorized");
    }
  }

  async addproduct(
    user_id: number,
    order: makeorders
  ): Promise<makeorders | null> {
    try {
      const conn = await client.connect();
      const sql = "SELECT id FROM orders WHERE user_id = $1 AND status = $2";
      const order_id = await conn.query(sql, [user_id, "active"]);
      if (order_id) {
        const sql2 =
          "INSERT INTO orders_products (quantity,order_id,product_id) VALUES ($1,$2,$3)";
        const results = await conn.query(sql2, [
          order.quantity,
          order_id,
          order.product_id,
        ]);
        const resulting = results.rows[0];
        conn.release();
        return resulting;
      }
      conn.release();
      console.error(`There are no active orders for user ${user_id}`);
      return null;
    } catch (err) {
      throw new Error(
        `Cannot add product ${order.product_id} to order: ${err}`
      );
    }
  }
}
