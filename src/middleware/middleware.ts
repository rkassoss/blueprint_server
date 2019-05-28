import { Request } from "express";
import { Response } from "express";


export function CORS( request: Request, response: Response, next:any){
    console.log('adding CORS')
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers","Content-Type")
    next()
}