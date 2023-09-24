module.exports = function (i,q){
    const puppeteer = require('puppeteer');
    const fs = require('fs');
    const readline = require('readline').createInterface({input: process.stdin , output: process.stdout});
    const path = require('path');

    
    
    // Start puppeteer
    
    const initiatePuppeteer = async(url)  => {
        const browser = await puppeteer.launch({
            headless: "new",
            defaultViewport: null,
        });
        const page = await browser.newPage();
        page.setDefaultTimeout(100000)
    
        await page.goto(url);
        return { browser, page };
    };
    
    // Filters the page
    
    const scrape = async(page) => {
        let content = await page.$eval('#main-content', div => div.innerHTML);
        return content;
    };
    
    // Formatter
    
    function toThreeDigits(num) {
        return String(num).padStart(3, '0');
    };
    
    //Runs on start
    
    // readline.question("Which SCP should we start at? ", name => {
    //     let i = parseInt(name);
    // readline.question("Which SCP should we end at? ", name => {
    //     let q = parseInt(name);
        console.log("\n"+i,q+"\n")
        if (1 < i & q >= i) { 
            readline.close();
            SCP(i,q);
        }else {
            if (2 > i) {
                i = 2;
                readline.close();
                SCP(i,q);
    
    
            }else {
            console.log("Something went wrong");
            readline.close();
            }
        }
    
    
    
    async function SCP(i,q)  {
        const starting = `\n
    ███████ ████████  █████  ██████  ████████ ██ ███    ██  ██████  
    ██         ██    ██   ██ ██   ██    ██    ██ ████   ██ ██       
    ███████    ██    ███████ ██████     ██    ██ ██ ██  ██ ██   ███ 
         ██    ██    ██   ██ ██   ██    ██    ██ ██  ██ ██ ██    ██ 
    ███████    ██    ██   ██ ██   ██    ██    ██ ██   ████  ██████  
                                                                                                                             
     `
        console.log(starting);
        // Define error and success variables.
        let i_write = 0;
        let i_fails = 0;
        let i_error = 0;
        // Start for time calculations.
        first_time = Date.now();
        try {
        for (;q >= i ;) {
            try {
                const location = __dirname+"/Data/SCP-"+toThreeDigits(i)+".html";
                // Checks if /Data folder exist.
                if (!fs.existsSync(__dirname+"/Data")) {
                    fs.mkdirSync(__dirname+"/Data")
                };
                // SCP's have for 1 to 1000 the format 001 and up.
                const url = 'https://scp-wiki.wikidot.com/scp-'+toThreeDigits(i);
                // Console log for status indication.
                console.log("scp-"+toThreeDigits(i)+":");
                console.log(location);
                console.log(url+"\n");
                let start = Date.now();
                // Gets the page.
                const { browser, page } = await initiatePuppeteer(url)
                console.log("Send and is parsing.")
                const pageContent = await scrape(page);
                // Writes file to disk in the current dir and writes it in .html
                fs.writeFile(location,pageContent, (err) => {
                    if (err) {
                        console.log(err)
                        i_fails++
                    }else {
                        console.log("Successful Write!!\n______________________________");
                        i_write++
                    }})
                await browser.close();
                // Calculates delta and displays.
                let end = Date.now();
                let delta = end-start;
                console.log(Math.round((delta/1000)*1000)/1000+" Seconds or "+Math.round((delta/1000/60)*100)/100+" Minutes")
                // Increments by 1
                i++
            }
            catch (err){
                console.log(err);
                readline.close();
                i_error++
                i++
            }
        }
        console.log('STOPPING!!\n');
        // Delta of time
        last_time = Date.now();
        delta_time = last_time-first_time;
        // Calculates time and how long it took.
        console.log("Total Time:\n______________________________")
        console.log(Math.round((delta_time/1000)*1000)/1000+" Seconds or "+Math.round((delta_time/1000/60)*100)/100+" Minutes\n");
        console.log("Successful and Failed Saves:\n______________________________")
        // Writes all the Fails, Errors and Successes.
        console.log(i_write+" Successful "+i_fails+" Fails "+i_error+" Error")
        readline.close();
        readline.close();
        readline.close();
        }
        catch (err) {
            console.log(err);
        };
    };
    
};
