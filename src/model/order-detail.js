const { Schema, model } = require('mongoose');

const orderDetailSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Schema.Types.Decimal128,
    required: true,
  },
});

module.exports = model('OrderDetail', orderDetailSchema);
