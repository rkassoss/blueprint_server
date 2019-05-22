"use strict";

import { Response, Request, NextFunction} from "express";
import { OptionsJson } from "body-parser";



export async function getLayout(req: ( Request & OptionsJson), res: Response, next: NextFunction){

    console.log(req.body);
    res.send( {'name': 'brett'})

}

export async function saveLayout(req: ( Request & OptionsJson), res: Response, next: NextFunction){

    console.log(req.body);
    res.send( {'name': 'brett'})

}