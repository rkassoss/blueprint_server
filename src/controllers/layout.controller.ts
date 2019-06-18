"use strict";

import { Response, Request, NextFunction} from "express";
import { OptionsJson } from "body-parser";
import puppeteer from 'puppeteer';

var fs = require("fs");

export async function getLayout(req: Request, res: Response, next: NextFunction){

    let fileName = req.params.user+'_'+req.params.layoutIds+'.json';
    fs.readFile(fileName, function(err:string, buf:any) {
        res.send( buf.toString())
    });
  
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

async function printPDF(fullUrl:string) {
	console.log(fullUrl);
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page.goto(fullUrl, {waitUntil: 'networkidle0'});
	await page.addStyleTag({ content: '.nav { display: none} .navbar { border: 0px} #print-button {display: none}' })

	const pdf = await page.pdf({ format: 'A4' });
   
	await browser.close();
	return pdf
};

// generatePDF with puppeteer
export async function generatePdf(req: Request, res: Response, next: NextFunction){
	console.log(req.headers.referer);
	let fullUrl = req.headers.referer;
	printPDF(fullUrl).then(function(pdf){
		res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length });
		res.send(pdf);
	});
}