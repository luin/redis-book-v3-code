const pMap = require("p-map");
const Redis = require("ioredis");
const redis = new Redis({ port: 9090, keyPrefix: "book:" });

const RECORD_COUNT = 1000000;
let gid = 0;

// 使用有序集合+散列类型
async function insertRecord1() {
  gid += 1;

  await redis
    .pipeline()
    .zadd("visitorList", Date.now(), gid)
    .hset(`visitorList:${gid}`, "ua", "ua", "ip", "ip")
    .exec();
}

// 使用流类型
async function insertRecord2() {
  await redis.xadd("visitorList", "*", "ua", "ua", "ip", "ip");
}

async function main() {
  await pMap(new Array(RECORD_COUNT).fill(0), insertRecord2, {
    concurrency: 1000,
  });
  redis.quit();
}

main();
