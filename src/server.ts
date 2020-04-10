"use strict";

import * as bodyParser from "body-parser";
import  express from "express";
import * as middleware from "./middleware/middleware";
import  layoutRouter  from './routes/layout.routes';

export class BlueprintServer {

    public app: express.Application;
    public router: express.Router;
    private server: any;
    private port: number;

    constructor(port: number){
        this.port = port;
        this.app = express();
        this.router = express.Router();
        this.middleware();
        this.routes();
        this.start();
    }

    private middleware(){
        this.app.use(middleware.CORS);
    }

    private routes(){
        this.app.use('/api', layoutRouter);
    }

    async start() {
        this.server = await this.app.listen(this.port);
        console.log('started server')
    }

    stop(){
        this.server.close()
    }
}