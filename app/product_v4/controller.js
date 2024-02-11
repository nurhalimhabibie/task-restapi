const Product = require("./model");
const path = require("path");
const fs = require("fs");

const index = (req, res) => {
  const { name } = req.query;

  if (name) {
    Product.findOne({ name: { $regex: name, $options: "i" } })
      .then((result) => {
        if (!result) {
          res.status(404).send({ status: "failed", message: "Product by name not found" });
        } else {
          res.status(200).send(result);
        }
      })
      .catch((error) => res.send(error));
  } else {
    Product.find()
      .then((result) => res.status(200).send(result))
      .catch((error) => res.send(error));
  }
};

const view = (req, res) => {
  const { id } = req.params;

  Product.findById(id)
    .then((result) => {
      if (!result) {
        res.status(404).send({ status: "failed", message: "Product by _id not found" });
      } else {
        res.status(200).send(result);
      }
    })
    .catch((error) => res.send(error));
};

const store = (req, res) => {
  const { name, price, stock, status } = req.body;
  const image = req.file;

  if (image) {
    const target = path.join(__dirname, "../../uploads", image.originalname);
    fs.renameSync(image.path, target);
    Product.create({ name, price, stock, status, image_url: `http://localhost:3000/public/${image.originalname}` })
      .then((result) => res.status(201).send(result))
      .catch((error) => res.send(error));
  }
};

const update = (req, res) => {
  const { id } = req.params;
  const { name, price, stock, status } = req.body;
  const image = req.file;

  let imageUrl = "";
  if (image) {
    const target = path.join(__dirname, "../../uploads", image.originalname);
    fs.renameSync(image.path, target);
    imageUrl = `http://localhost:3000/public/${image.originalname}`;
  }

  let productData = { name, price, stock, status };

  if (imageUrl) {
    productData.image_url = imageUrl;
  }
  Product.findByIdAndUpdate(id, productData, { new: true })
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

  Product.findByIdAndDelete(id)
    .then((result) => {
      if (result) {
        res.status(200).send({ status: "success", message: "Product by _id deleted successfully" });
      } else {
        res.status(404).send({ status: "failed", message: "Product by _id failed to delete" });
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
