const { Router } = require('express');
const router = Router();
const authorize = require('../middleware/authorization');
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderWithDetail,
  deleteOrder,
} = require('../controller/order.controller');

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders with their details
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of orders with their details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   user:
 *                     type: string
 *                   totalAmount:
 *                     type: number
 *                     format: float
 *                   status:
 *                     type: string
 *                   paymentMethod:
 *                     type: string
 *                   shippingAddress:
 *                     type: string
 *                   details:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         productId:
 *                           type: string
 *                         quantity:
 *                           type: integer
 *                         price:
 *                           type: number
 *                           format: float
 *       403:
 *         description: Forbidden
 *   post:
 *     summary: Create a new order with order details
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 example: "userId123"
 *               totalAmount:
 *                 type: number
 *                 format: float
 *                 example: 299.99
 *               status:
 *                 type: string
 *                 example: "Pending"
 *               paymentMethod:
 *                 type: string
 *                 example: "Credit Card"
 *               shippingAddress:
 *                 type: string
 *                 example: "123 Main St, Anytown, USA"
 *               orderDetails:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "productId123"
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 149.99
 *     responses:
 *       201:
 *         description: Order and Order Details Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order and Order Details Created Successfully"
 *                 order:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     user:
 *                       type: string
 *                     totalAmount:
 *                       type: number
 *                       format: float
 *                     status:
 *                       type: string
 *                     paymentMethod:
 *                       type: string
 *                     shippingAddress:
 *                       type: string
 *                 orderDetails:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       orderId:
 *                         type: string
 *                       productId:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *                       price:
 *                         type: number
 *                         format: float
 *       400:
 *         description: Bad Request
 *       403:
 *         description: Forbidden
 */
router
  .route('/')
  .get(authorize(['admin', 'user']), getAllOrders)
  .post(authorize(['admin', 'user']), createOrder);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID with its details
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order data with details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 user:
 *                   type: string
 *                 totalAmount:
 *                   type: number
 *                   format: float
 *                 status:
 *                   type: string
 *                 paymentMethod:
 *                   type: string
 *                 shippingAddress:
 *                   type: string
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *                       price:
 *                         type: number
 *                         format: float
 *       404:
 *         description: Order not found
 *       403:
 *         description: Forbidden
 *   put:
 *     summary: Update order and its details
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 example: "userId123"
 *               totalAmount:
 *                 type: number
 *                 format: float
 *                 example: 299.99
 *               status:
 *                 type: string
 *                 example: "Shipped"
 *               paymentMethod:
 *                 type: string
 *                 example: "Credit Card"
 *               shippingAddress:
 *                 type: string
 *                 example: "123 Main St, Anytown, USA"
 *               orderDetails:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "productId123"
 *                     quantity:
 *                       type: integer
 *                       example: 3
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 199.99
 *     responses:
 *       200:
 *         description: Order and Order Details Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order and Order Details Updated Successfully"
 *                 order:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     user:
 *                       type: string
 *                     totalAmount:
 *                       type: number
 *                       format: float
 *                     status:
 *                       type: string
 *                     paymentMethod:
 *                       type: string
 *                     shippingAddress:
 *                       type: string
 *                 orderDetails:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       orderId:
 *                         type: string
 *                       productId:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *                       price:
 *                         type: number
 *                         format: float
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Order not found
 *       403:
 *         description: Forbidden
 *   delete:
 *     summary: Delete order and its details
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order and Order Details Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order and Order Details Deleted Successfully"
 *       404:
 *         description: Order not found
 *       403:
 *         description: Forbidden
 */
router
  .route('/:id')
  .get(authorize(['admin', 'user']), getOrderById)
  .put(authorize(['admin']), updateOrderWithDetail)
  .delete(authorize(['admin']), deleteOrder);

module.exports = router;
