"use strict";

import { Response, Request, NextFunction} from "express";
import { OptionsJson } from "body-parser";

var fs = require("fs");


export async function getLayout(req: Request, res: Response, next: NextFunction){

    console.log(req.params);
    res.send( {'name': 'brett'})

}

export async function saveLayout(req: ( Request & OptionsJson), res: Response, next: NextFunction){

    
    

    let fileName = req.body.user+'_'+req.body.app+'.json';
    
    fs.writeFile(fileName, JSON.stringify(req.body.data), (err: string) => {
      if (err) console.log(err);
      console.log("Successfully Written to File.");
      console.log(req.body);
    res.send( {'name': 'brett'})
    });

    
}