## 一、使用openssl 公钥加密，私钥解密


### 1. 使用rsa算法生成私钥
![](https://gitee.com/BiAn-MoShangHuaKai/img/raw/master/data/20210310104205.png)
#### 2.通过私钥生成公钥
![](https://gitee.com/BiAn-MoShangHuaKai/img/raw/master/data/20210310104236.png)
公钥的长度比私钥的短
#### 3.使用公钥对文件进行加密
-inkey 指定公钥 ，对文件zxh.txt进行加密
文件后缀无所谓都行
![](https://gitee.com/BiAn-MoShangHuaKai/img/raw/master/data/20210310104256.png)
#### 4. 通过私钥进行解密
![](https://gitee.com/BiAn-MoShangHuaKai/img/raw/master/data/20210310104319.png)
## 二、使用openssl进行签名和验签
签名和验签可以用来验证一个文件有没有被修改过
#### 5. 使用私钥对文件进行签名
dgst：摘要算法
md5：指定的hash算法
![](https://gitee.com/BiAn-MoShangHuaKai/img/raw/master/data/20210310104359.png)
#### 6. 通过公钥进行验签
message.sign:第5步中签名过的文件
zxh.txt:被签名的源文件
Verified OK：表明 zxh.txt没有被进行修改
![](https://gitee.com/BiAn-MoShangHuaKai/img/raw/master/data/20210310104418.png)

----------
## 三、使用openssl生成证书
CA:第三方比较有权威的机构。
传输公钥的时候一般也不安全，因此需要第三方的公钥对公钥进行加密。
1. 生成CA的私钥
```bash
genrsa -out ca-key.pem 1024 #创建私钥
```
![](https://gitee.com/BiAn-MoShangHuaKai/img/raw/master/data/20210310104441.png)
2. 创建证书请求
证书请求：记录CA或者说是RSA本身的一些信息，生成的文件是 csr结尾的证书请求
```bash
req -new -out ca-req.csr -key ca-key.pem
```
* ca-req.csr 输出的 证书请求的路径
* ca-key.pem: 私钥的路径
![](https://gitee.com/BiAn-MoShangHuaKai/img/raw/master/data/20210310104537.png)
3. 自签一个证书
```bash
x509 -req -in ca-req.csr -out ca-cert.pem -signkey ca-key.pem -days 365
```
-signkey:使用私钥签名，目的在于防止别人修改证书
![](https://gitee.com/BiAn-MoShangHuaKai/img/raw/master/data/20210310104556.png)
* 生成server证书
与上述步骤相同
1. 生成私钥
```bash
genrsa -out server-key.pem 1024
```
2. 创建证书请求
```bash
req -new -out  server-req.csr -key server-key.pem 
```
3. 签署证书（CA签署时有点不同，需要指定CA的证书和私钥）
正常来说签署证书是在CA机构的电脑上进行签名的，因为私人不可能拿到CA的私钥
```bash
x509 -req -in server-req.csr -out  server-csr.pem -signkey server-key.pem -CA ca-cert.pem  -CAkey ca-key.pem -CAcreateserial -days 365
```
![](https://gitee.com/BiAn-MoShangHuaKai/img/raw/master/data/20210310104616.png)

## 四、使用证书开启https的web服务
1. 安装nodejs
```bash
yum install node js 
```
2. 编写js文件
```js
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
```
3. 启动web服务
```bash
node index.js
```
然后在浏览器中使用https://xxxx.xxx.xxx.xxxx:8000 访问
## 四、项目的github路径
https://github.com/BAMSHK/openssl-demo.git
