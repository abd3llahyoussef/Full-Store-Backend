import client from '../database'

export type order = {
    id?:number,
    status:string,
    user_id?:number 
}

export class Orderstore {

    async create (user_id:number) : Promise<order[]> {
        try{
            const conn = await client.connect()
            const sql = 'SELECT id FROM orders WHERE user_id=$1 AND status="active"'
            const checkactivity = await conn.query(sql,[user_id])
            if(checkactivity.rows[0]){
                conn.release()
                throw new Error('there is still an active orders')
            }else{
                const sql = 'INSERT INTO orders (user_id,status) VALUES ($1,$2);'
                const placeorder = await conn.query(sql,[user_id,"active"])
                const result = placeorder.rows[0]
                conn.release()
                return result
            }
        }catch(err){
            throw new Error ('can not make an order')
        }
    }

    async getcompletedorders (user_id:number) : Promise<order[]>{
        try{
            const conn = await client.connect()
            const sql = 'SELECT * FROM orders WHERE user_id=$1 AND status=$2'
            const getorders = await conn.query(sql,[user_id,"complete"])
            const results : order[] = getorders.rows[0]
            conn.release()
            return results
        }catch(err){
            throw new Error('no completed orders')
        }
    }
}