const { ObjectId } = require("mongodb");
const db = require("../../config/mongodb");
const fs = require("fs");
const path = require("path");

const index = (req, res) => {
  const { name } = req.query;
  const searchName = { name: { $regex: name, $options: "i" } };

  if (name) {
    db.collection("products")
      .findOne(searchName)
      .then((result) => {
        if (!result) {
          res.status(404).send({ status: "failed", message: "Product by name not found" });
        } else {
          res.status(200).send(result);
        }
      })
      .catch((error) => res.send(error));
  } else {
    db.collection("products")
      .find()
      .toArray()
      .then((result) => res.status(200).send(result))
      .catch((error) => res.send(error));
  }
};

const view = (req, res) => {
  const { id } = req.params;

  db.collection("products")
    .findOne({ _id: new ObjectId(id) })
    .then((result) => res.send(result))
    .catch((error) => res.send(error));
};

const store = (req, res) => {
  const { name, price, stock, status } = req.body;
  const image = req.file;

  if (image) {
    const target = path.join(__dirname, "../../uploads", image.originalname);
    fs.renameSync(image.path, target);
    db.collection("products")
      .insertOne({ name, price, stock, status, image_url: `http://localhost:3000/public/${image.originalname}` })
      .then((result) => res.send(result))
      .catch((error) => res.send(error));
  }
};

const update = (req, res) => {
  const { id } = req.params;
  const { name, price, stock, status } = req.body;
  const image = req.file;

  let productData = { name, price, stock, status };

  if (image) {
    const target = path.join(__dirname, "../../uploads", image.originalname);
    fs.renameSync(image.path, target);
    productData.image_url = `http://localhost:3000/public/${image.originalname}`;
  }

  db.collection("products")
    .updateOne({ _id: new ObjectId(id) }, { $set: productData })
    .then((result) => {
      if (result) {
        res.status(200).send({ status: "success", message: "Product updated successfully" });
      } else {
        res.status(404).send({ status: "failed", message: "Product failed to update" });
      }
    })
    .catch((error) => res.send(error));
};

const deleteProduct = (req, res) => {
  const { id } = req.params;

  db.collection("products")
    .deleteOne({ _id: new ObjectId(id) })
    .then((result) => {
      if (result) {
        res.status(200).send({ status: "success", message: "Product by id deleted successfully" });
      } else {
        res.status(404).send({ status: "failed", message: "Product by id failed to delete" });
      }
    })
    .catch((error) => res.send(error));
};

module.exports = {
  index,
  view,
  store,
  update,
  deleteProduct,
};
