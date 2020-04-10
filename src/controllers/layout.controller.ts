"use strict";

import { Response, Request, NextFunction} from "express";
import { OptionsJson } from "body-parser";
import puppeteer from 'puppeteer';

var fs = require("fs");
var statesArray = ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];

// var statesArray = ['Alabama','Alaska','American Samoa'];

async function asyncForEach(array:any, callback: any) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

// scrap table
export async function scrapeEvive(req: Request, res: Response, next: NextFunction) {
	const stateInputSelector = '#root > div > main > div > div.main > div.main-sidebar > div > div.no-sites-container > div:nth-child(2) > input';
	const countyInputSelector = '#root > div > main > div > div.main > div.main-sidebar > div > div.no-sites-container > div:nth-child(4) > input';
	let fullUrl = 'https://www.evive.care';
	// const browser = await puppeteer.launch({ headless: true });
	const browser = await puppeteer.launch({ headless: false});
	const page = await browser.newPage();
	await page.goto(fullUrl, {waitUntil: 'networkidle0'});
	
	const start = async () => {
		let allSitesForAllStates: Array<any> = [];
		await asyncForEach(statesArray, async (state: string) => {
			await page.waitFor(stateInputSelector);
			await page.type(stateInputSelector, state);
			// wait fo the query to finish
			// await new Promise(function(resolve) {setTimeout(resolve, 500)});
			await page.waitFor(countyInputSelector);
			await page.type(countyInputSelector, 'All counties', { delay: 200 });
			await page.keyboard.press('Enter');

			// wait fo the query to finish
			await new Promise(function(resolve) {setTimeout(resolve, 1000)});
			// start extracting data from the html structure
			let testSiteData = await page.evaluate(() => {
				let testSites: Array<any> = [];
				// get test site elements
				let siteElms = document.querySelectorAll('div.site-card-wrapper');
				// loop through them and extract
        siteElms.forEach((siteElement: any) => {
					let siteJson = {
						name: '',
						content: '',
						location: '',
						info: '',
						instructions: '',
						sourceUrl: ''
					}
					try {
							siteJson.name = siteElement.querySelector('div.site-card-name').innerText;
							if(siteJson.name == 'Guidelines') {
								siteElement.querySelectorAll('li').forEach((el: any) => {
									siteJson.content += el.innerText + '|'
								})
							} else {
								siteJson.content = siteElement.querySelector('div.site-card-content').innerText;
							}
							if(siteElement.querySelector('div.site-card-content a a')) {
								siteJson.location = siteElement.querySelector('div.site-card-content a a').innerText;
							}
							siteJson.info = siteElement.querySelector('div.site-card-info-container').innerText;
							siteJson.instructions = siteElement.querySelector('div.site-card-instructions').innerText;
							siteJson.sourceUrl = siteElement.querySelector('div.site-card-instructions a').getAttribute("href");
					}
					catch (exception){
						console.log(exception)
					}
					testSites.push(siteJson);
				});
				// console.log('final data',testSites);
				return testSites;
			});
			// console.log(state +' sites', testSiteData);
			allSitesForAllStates.push(testSiteData)
		});
		console.log('All Sites for all States:', allSitesForAllStates);
		await browser.close();

		fs.writeFile('EVIVE_scarped_COVID19TestingSites.json', JSON.stringify(allSitesForAllStates), (err: string) => {
			if (err) console.log(err);
				console.log("Successfully Written to File.");
		});
	}

	start();

}