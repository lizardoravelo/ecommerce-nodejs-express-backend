const Product = require('../model/product');
const handleErrorResponse = require('../middleware/error-handler');

const productCtrl = {};

productCtrl.getAllProducts = async (req, res) => {
  try {
    const product = await Product.find();
    res.status(200).json(product);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

productCtrl.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

productCtrl.createProduct = async (req, res) => {
  const { name, description, price, stock, category, images } = req.body;

  if (!name || !price || !stock) {
    res.status(400).json({ error: 'Name, Price and Stock are required' });
  }

  try {
    const newProduct = await new Product({ name, description, price, stock, category, images }).save();
    res.status(201).json({
      message: 'Product Created Successfully',
      product: newProduct,
    });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

productCtrl.putUpdateProduct = async (req, res) => {
  const { name, description, price, stock, category, images } = req.body;

  if (!name || !price || !stock) {
    res.status(400).json({ error: 'Name, Price and Stock are required' });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, stock, category, images },
      { new: true, runValidators: true },
    );
    if (!updatedProduct) {
      res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product Updated Successfully',
      product: updatedProduct,
    });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

productCtrl.patchUpdateProduct = async (req, res) => {
  const { name, description, price, stock, category, images } = req.body;

  // Ensure at least one field is provided
  if (!name && !description && !stock) {
    return res.status(400).json({ error: 'At least one field is required to update' });
  }

  // Create an update object with only the provided fields
  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (description !== undefined) updateFields.description = description;
  if (price !== undefined) updateFields.price = price;
  if (stock !== undefined) updateFields.stock = stock;
  if (category !== undefined) updateFields.category = category;
  if (images !== undefined) updateFields.images = images;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields }, // Use $set to update only the provided fields
      { new: true, runValidators: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product Updated Successfully',
      product: updatedProduct,
    });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

module.exports = productCtrl;
