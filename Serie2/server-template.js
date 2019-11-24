var fs = require('fs'); 
var https = require('https'); 
var options = { 
  key: fs.readFileSync("./secure-server-pfx.pem"), 
  cert: fs.readFileSync("./secure-server-cer.pem"),  
  ca: fs.readFileSync("./CA1-cer.pem"), 
  requestCert: true, 
  rejectUnauthorized: true 
}; 

https.createServer(options, function (req, res) { 
  console.log(new Date()+' '+ 
    req.connection.remoteAddress+' '+ 
    req.socket.getPeerCertificate().subject.CN+' '+ 
    req.method+' '+req.url); 
  res.writeHead(200); 
  res.end("Secure Hello World with node.js\n"); 
}).listen(4433);

console.log('Listening @4433 v2');