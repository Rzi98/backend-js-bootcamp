const http = require('http');
const url = require('url');
const fs = require('fs');

const replaceTemplate = require('./modules/replaceTemplate');

const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data); // json.loads(data) to object-array

const server = http.createServer((req, res) => {  

    const {query, pathname} = url.parse(urlString=req.url, parseQueryString=true);  // QueryString = ?id=0
    
    // Overview page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);        
    // Product page
    } else if (pathname === '/product') {
        res.writeHead(200, {'Content-type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);    
    // API page
    } else if (pathname === '/api') {
        // writeHead must be before res.end
        res.writeHead(200, {        
            'Content-type': 'application/json'
        });
        res.end(data); // must return a string to display on client side/ browser

    // Not found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>');
    }         
});

server.listen(8000, '127.0.0.1', () => {      
    console.log('Listening to requests on port 8000');
})        

