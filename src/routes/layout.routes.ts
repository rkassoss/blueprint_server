import {  Router} from  "express";
import * as bodyParser from "body-parser";
import * as layoutCrl from "../controllers/layout.controller"

const router = Router();
const jsonParser = bodyParser.json();

router.use(jsonParser)

router.get('/getUserLayout/:user/:layoutIds', layoutCrl.getLayout);
router.post('/saveUserLayout', layoutCrl.saveLayout);

export default router;
