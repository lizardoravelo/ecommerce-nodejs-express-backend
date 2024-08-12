const { Schema, model } = require('mongoose');

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    images: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = model('Product', productSchema);
