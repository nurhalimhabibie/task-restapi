const { MongoClient } = require("mongodb");

const url = "mongodb://eduwork:asdasdasd@localhost:27017?authSource=admin";
const client = new MongoClient(url);

(async () => {
  try {
    await client.connect();
    console.log("Koneksi mongodb berhasil");
  } catch (e) {
    console.log(e);
  }
})();

const db = client.db("eduwork-native");

module.exports = db;
