const Order = require('../models/order');
const OrderDetail = require('../models/orderDetail');
const handleErrorResponse = require('../middleware/error-handler');

const orderCtrl = {};

// Create a new order with order details
orderCtrl.createOrder = async (req, res) => {
  const { user, totalAmount, status, paymentMethod, shippingAddress, orderDetails } = req.body;

  if (!user || !totalAmount || !status || !paymentMethod || !shippingAddress || !orderDetails) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const session = await Order.startSession();
  session.startTransaction();

  try {
    const newOrder = new Order({
      user,
      totalAmount,
      status,
      paymentMethod,
      shippingAddress,
    });

    await newOrder.save({ session });

    const newOrderDetails = orderDetails.map(detail => ({
      orderId: newOrder._id,
      productId: detail.productId,
      quantity: detail.quantity,
      price: detail.price,
    }));

    await OrderDetail.insertMany(newOrderDetails, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: 'Order and Order Details Created Successfully',
      order: newOrder,
      orderDetails: newOrderDetails,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    handleErrorResponse(res, err);
  }
};

// Get all orders with their details
orderCtrl.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user status paymentMethod');
    const orderDetails = await OrderDetail.find();

    const ordersWithDetails = orders.map(order => ({
      ...order.toObject(),
      details: orderDetails.filter(detail => detail.orderId.toString() === order._id.toString()),
    }));

    res.status(200).json(ordersWithDetails);
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

// Get order by ID with its details
orderCtrl.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user status paymentMethod');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderDetails = await OrderDetail.find({ orderId: order._id });
    res.status(200).json({
      ...order.toObject(),
      details: orderDetails,
    });
  } catch (err) {
    handleErrorResponse(res, err);
  }
};

// Update order and its details
orderCtrl.updateOrderWithDetail = async (req, res) => {
  const { user, totalAmount, status, paymentMethod, shippingAddress, orderDetails } = req.body;

  if (!user || !totalAmount || !status || !paymentMethod || !shippingAddress || !orderDetails) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const session = await Order.startSession();
  session.startTransaction();

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { user, totalAmount, status, paymentMethod, shippingAddress },
      { new: true, runValidators: true, session },
    );

    if (!updatedOrder) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Order not found' });
    }

    await OrderDetail.deleteMany({ orderId: req.params.id }, { session });

    const newOrderDetails = orderDetails.map(detail => ({
      orderId: updatedOrder._id,
      productId: detail.productId,
      quantity: detail.quantity,
      price: detail.price,
    }));

    await OrderDetail.insertMany(newOrderDetails, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: 'Order and Order Details Updated Successfully',
      order: updatedOrder,
      orderDetails: newOrderDetails,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    handleErrorResponse(res, err);
  }
};

// Delete order and its details
orderCtrl.deleteOrder = async (req, res) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    const order = await Order.findByIdAndDelete(req.params.id, { session });
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Order not found' });
    }

    await OrderDetail.deleteMany({ orderId: order._id }, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Order and Order Details Deleted Successfully' });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    handleErrorResponse(res, err);
  }
};

module.exports = orderCtrl;
