const { Router } = require('express');
const router = Router();
const authorize = require('../middleware/authorization');
const {
  getCartByUserId,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantityInCart,
} = require('../controller/cart.controller');

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get cart by user ID
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /cart:
 *   put:
 *     summary: Update item quantity in cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item quantity updated successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       400:
 *         description: Bad request
 */

router
  .route('/')
  .get(authorize(['user', 'admin']), getCartByUserId)
  .post(authorize(['user', 'admin']), addItemToCart)
  .put(authorize(['user', 'admin']), updateItemQuantityInCart)
  .delete(authorize(['user', 'admin']), removeItemFromCart);

module.exports = router;
