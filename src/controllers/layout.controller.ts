"use strict";

import { Response, Request, NextFunction} from "express";
import puppeteer from 'puppeteer';

var fs = require("fs");

// scrap table
export async function exportPdf(req: Request, res: Response, next: NextFunction) {
	const formSelector = '#puppetSelections';

	let fullUrl = 'https://chubbcyberindex.com/#/pdf-report';
	fullUrl = 'http://localhost:3000/#/pdf-report';
	let query = req.query;
	console.log(query);
	try {
			const browser = await puppeteer.launch({ 
					headless: false,
					devtools: true
			});
			const page = await browser.newPage();
			await page.goto(fullUrl, {waitUntil: 'networkidle2'});

			// wait fo the query to finish
			// await new Promise(function(resolve) {setTimeout(resolve, 1000)});
				
				await page.type('#puppetForm #puppetInput', query);
				await page.click("#puppetForm #submit");
				await page.waitForSelector('#selectionCompleted');
						

				const pdf = await page.pdf({ format: 'A4' });
				await browser.close();
				res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length });
        res.send(pdf);


	} catch(err) {
		console.error(err);
		res.send('there was an error');
	}

}