const headerText = { 
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*"
};
let server = http.createServer();
server.on('request', async (request, response) => {
    response.writeHead(200, headerText);
});

server.listen(process.env.PORT);
