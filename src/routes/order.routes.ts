import express,{Request,Response} from 'express'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import {order,Orderstore} from '../models/order'


dotenv.config()

const{TOKEN_SECRET} = process.env

const store = new Orderstore()

const make = async (req:Request,res:Response) =>{
    const user_id = req.body.id
    try{
        const makeit = await store.create(user_id)
        res.json(makeit)
    }catch(err){
        res.send(500).send(err)
    }
}

const getcomporders = async (req:Request,res:Response) =>{
    const user_id = parseInt(req.params.id)
    try{
        const getit = await store.getcompletedorders(user_id)
    }catch(err){
        res.send(500).send(err)
    }
}

const verifyauth = async (req:Request,res:Response,next:Function)=>{
    try{
        const autherizationHeader = req.headers.authorization
        const token = autherizationHeader? autherizationHeader.split(" ")[1] : ""
        const check = jwt.verify(token,TOKEN_SECRET as string)
    }catch(err){
        res.send(401)
        res.json(err)
    }
}

const orderrouter = (app : express.Application) =>{
    app.get('/createOrder',verifyauth,make)
    app.get('/completedorders',verifyauth,getcomporders)
}

export default orderrouter