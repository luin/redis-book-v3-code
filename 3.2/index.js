const http = require("http");
const url = require("url");
const querystring = require("querystring");

// 连接Redis
const Redis = require("ioredis");
const redis = new Redis({ host: "127.0.0.1", port: 6379 });

const server = http.createServer(async (req, res) => {
  const query = querystring.parse(url.parse(req.url).query);
  if (query.name) {
    // 如果提交了姓名则使用SET命令将姓名写入到Redis中
    await redis.set("name", query.name);
  }

  // 通过GET命令从Redis中读取姓名
  const name = await redis.get("name");

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end(`
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>我的第一个Redis程序</title>
  </head>
  <body>
    ${name ? `<p>您的姓名是：${name}</p>` : "<p>您还没有设置姓名。</p>"}
    <hr />
    <h1>更改姓名</h1>
    <form>
      <div>
        <label for="name">您的姓名：</label>
        <input type="text" name="name" id="name" />
      </div>
      <div>
        <button type="submit">提交</button>
      </div>
    </form>
  </body>
</html>
  `);
});

server.listen(3000, () => {
  console.log(`Server running at http://127.0.0.1:3000/`);
});
