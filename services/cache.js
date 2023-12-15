const mongoose = require('mongoose');
const createClient = require('redis').createClient;
const keys = require('../config/keys')

let client;
(async () => {
  client = await createClient(keys.redisUrl)
  .on('error', err => console.log('Redis Client Error', err))
  .connect();
})();
if(client?.isReady) {
  console.log('redis client is connected');
}



const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
  this.useCache = true;
  this.hashKey = options.key || '';
  return this;
}

mongoose.Query.prototype.exec = async function() {
  if(!this.useCache) {
    return exec.apply(this, arguments)
  }
  // Make a unique key to be stored in redis
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  // check if key exists in redis
  const cachedData = await client.hGet(this.hashKey, key);
  if (cachedData) {
    console.log('serving data from cache');
    const parsedCachedData = JSON.parse(cachedData);
    return Array.isArray(parsedCachedData)
    ? parsedCachedData.map((data) => new this.model(data))
    : new this.model(parsedCachedData);
  }

  // issue query to mongodb if data is not cached
  console.log('serving from database');
  const result = await exec.apply(this, arguments);
  await client.hSet(this.hashKey, key, JSON.stringify(result));
  return result;
}

module.exports = {
  clearHash(hashKey) {
    client.del(hashKey, (err, response) => {
      if( err) {
        console.log(err);
      }
      else if (response == 1) {
        console.log('deleted successfully');
      } else {
        console.log('cannot delete');
      }
    });
  }
}
