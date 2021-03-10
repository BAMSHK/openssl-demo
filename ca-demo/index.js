// 1. yum install -y nodejs 安装node
// 2. node inde.js 开启web服务
const https = require('https')
const fs = require('fs')

const options = {
	key: fs.readFileSync("./server-key.pem"), //server端的私钥
	cert: fs.readFileSync("./server-csr.pem") //server端的证书
}

https.createServer(options,(req,res)=>{
 res.writeHead(200)
 res.end('hello world \n')
}).listen(8000)
