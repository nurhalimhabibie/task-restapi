const Product = require("./model");
const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");

const index = async (req, res) => {
  const { search } = req.query;

  try {
    let products;
    if (search) {
      products = await Product.findAll({
        where: {
          name: {
            [Op.like]: `%${search}%`,
          },
        },
      });
    } else {
      products = await Product.findAll();
    }

    if (products.length > 0) {
      res.status(200).send(products);
    } else {
      res.status(404).json({
        message: "Product not found",
      });
    }
  } catch (e) {
    res.send(e);
  }
};

const view = async (req, res) => {
  const productsId = req.params.id;

  try {
    const product = await Product.findByPk(productsId);
    if (product) {
      res.status(200).send(product);
    } else {
      res.status(404).json({
        message: "Product not found",
      });
    }
  } catch (e) {
    res.send(e);
  }
};

const store = async (req, res) => {
  const { users_id, name, price, stock, status } = req.body;
  const image = req.file;

  try {
    if (!users_id || !name || !price || !stock || !status) {
      res.status(404).json({
        message: "Product is not complete",
      });
    } else {
      if (image) {
        const target = path.join(__dirname, "../../uploads", image.originalname);
        fs.renameSync(image.path, target);
        await Product.sync();
        const result = await Product.create({
          users_id,
          name,
          price,
          stock,
          status,
          image_url: `http://localhost:3001/public/${image.originalname}`,
        });
        res.status(201).send(result);
      } else {
        await Product.sync();
        const result = await Product.create({
          users_id,
          name,
          price,
          stock,
          status,
        });
        res.status(201).send(result);
      }
    }
  } catch (e) {
    res.send(e);
  }
};

const update = async (req, res) => {
  const productsId = req.params.id;
  const { users_id, name, price, stock, status } = req.body;
  const image = req.file;

  try {
    const product = await Product.findByPk(productsId);
    if (product) {
      if (image) {
        const target = path.join(__dirname, "../../uploads", image.originalname);
        fs.renameSync(image.path, target);
        await product.update({
          users_id,
          name,
          price,
          stock,
          status,
          image_url: `http://localhost:3001/public/${image.originalname}`,
        });
      } else {
        await product.update({
          users_id,
          name,
          price,
          stock,
          status,
        });
      }
      res.status(200).send(product);
    } else {
      res.status(404).json({
        message: "Product failed to update",
      });
    }
  } catch (e) {
    res.send(e);
  }
};

const destroy = async (req, res) => {
  const productsId = req.params.id;
  try {
    const product = await Product.findByPk(productsId);
    if (product) {
      await product.destroy();
      res.status(200).json({
        message: "Product by id deleted successfully",
      });
    } else {
      res.status(404).json({
        message: "Product by id failed to delete",
      });
    }
  } catch (e) {
    res.send(e);
  }
};

module.exports = {
  index,
  view,
  store,
  update,
  destroy,
};
