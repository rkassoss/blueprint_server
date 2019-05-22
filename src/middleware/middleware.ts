import { Request } from "express";
import { Response } from "express";


export function CORS( request: Request, response: Response, next:any){
    console.log('adding CORS')
    response.header("Access-Control-Allow-Orgin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
}