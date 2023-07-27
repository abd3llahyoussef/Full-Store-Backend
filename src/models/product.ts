import client from "./../database";

export type prod = {
  id?: Number;
  name: String;
  price: Number;
  category: String;
};

export class Product {
  async getproduct(): Promise<prod[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT name,price,category FROM products";
      const result = await conn.query(sql);
      const res = result.rows;
      conn.release();
      return res;
    } catch (err) {
      throw new Error("NO products found");
    }
  }
  async showproduct(id: number): Promise<prod[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT name,price,category FROM products WHERE id = $1";
      const result = await conn.query(sql, [id]);
      const res = result.rows[0];
      conn.release();
      return res;
    } catch (err) {
      throw new Error("NO products found");
    }
  }
}
