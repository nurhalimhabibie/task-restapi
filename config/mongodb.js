const { MongoClient } = require("mongodb");

const url = "mongodb://eduwork:asdasdasd@127.0.0.1:27017?authSource=admin";
const client = new MongoClient(url);

(async () => {
  try {
    await client.connect();
    console.log("Koneksi mongodb berhasil");
  } catch (err) {
    console.log(err);
  }
})();

const db = client.db("eduwork-native");

module.exports = db;
