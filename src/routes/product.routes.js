const { Router } = require('express');
const router = Router();
const authorize = require('../middleware/authorization');
const {
  getAllProducts,
  getProductById,
  createProduct,
  putUpdateProduct,
  patchUpdateProduct,
} = require('../controller/product.controller');

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Get all products - Accessible by admin and user
 *     description: Retrieves a list of all products in the system. Both admin and user roles can access this route.
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The product ID
 *                   name:
 *                     type: string
 *                     description: The name of the product
 *                   description:
 *                     type: string
 *                     description: The description of the product
 *                   price:
 *                     type: number
 *                     format: float
 *                     description: The price of the product
 *                   stock:
 *                     type: integer
 *                     description: The stock quantity of the product
 *                   category:
 *                     type: string
 *                     description: The category of the product
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *                       description: URLs of the product images
 *       403:
 *         description: Forbidden - Only admin and user roles can access this route
 *   post:
 *     summary: Create a new product - Only admin can access this route
 *     description: Creates a new product in the system. This route is restricted to users with the "admin" role.
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Laptop"
 *                 description: The name of the product
 *               description:
 *                 type: string
 *                 example: "High performance laptop"
 *                 description: A brief description of the product
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 999.99
 *                 description: The price of the product
 *               stock:
 *                 type: integer
 *                 example: 10
 *                 description: The available stock quantity
 *               category:
 *                 type: string
 *                 example: "Electronics"
 *                 description: The category to which the product belongs
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: URLs of the product images
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product Created Successfully"
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The product ID
 *                     name:
 *                       type: string
 *                       description: The name of the product
 *                     description:
 *                       type: string
 *                       description: The description of the product
 *                     price:
 *                       type: number
 *                       format: float
 *                       description: The price of the product
 *                     stock:
 *                       type: integer
 *                       description: The available stock quantity
 *                     category:
 *                       type: string
 *                       description: The category of the product
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                         description: URLs of the product images
 *       400:
 *         description: Bad request - Invalid input data
 *       403:
 *         description: Forbidden - Only admin can access this route
 */
router
  .route('/')
  .get(authorize(['admin', 'user']), getAllProducts)
  .post(authorize(['admin']), createProduct);

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Get a product by ID - Accessible by admin and user
 *     description: Retrieves the details of a product by its ID. Both admin and user roles can access this route.
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to retrieve
 *     responses:
 *       200:
 *         description: Product data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The product ID
 *                 name:
 *                   type: string
 *                   description: The name of the product
 *                 description:
 *                   type: string
 *                   description: The description of the product
 *                 price:
 *                   type: number
 *                   format: float
 *                   description: The price of the product
 *                 stock:
 *                   type: integer
 *                   description: The stock quantity of the product
 *                 category:
 *                   type: string
 *                   description: The category of the product
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: URLs of the product images
 *       404:
 *         description: Product not found - No product with the specified ID exists
 *       403:
 *         description: Forbidden - Only admin and user roles can access this route
 *
 *   put:
 *     summary: Fully update a product by ID - Only admin can access this route
 *     description: Updates a product's details by its ID. This route requires the entire product object to be sent and is restricted to users with the "admin" role.
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Laptop"
 *                 description: The updated name of the product
 *               description:
 *                 type: string
 *                 example: "Updated high performance laptop"
 *                 description: The updated description of the product
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 899.99
 *                 description: The updated price of the product
 *               stock:
 *                 type: integer
 *                 example: 5
 *                 description: The updated stock quantity
 *               category:
 *                 type: string
 *                 example: "Electronics"
 *                 description: The updated category of the product
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: URLs of the updated product images
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product Updated Successfully"
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The product ID
 *                     name:
 *                       type: string
 *                       description: The updated name of the product
 *                     description:
 *                       type: string
 *                       description: The updated description of the product
 *                     price:
 *                       type: number
 *                       format: float
 *                       description: The updated price of the product
 *                     stock:
 *                       type: integer
 *                       description: The updated stock quantity
 *                     category:
 *                       type: string
 *                       description: The updated category of the product
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                         description: URLs of the updated product images
 *       400:
 *         description: Bad request - Invalid input data
 *       404:
 *         description: Product not found - No product with the specified ID exists
 *       403:
 *         description: Forbidden - Only admin can access this route
 *
 *   patch:
 *     summary: Partially update a product by ID - Only admin can access this route
 *     description: Partially updates a product's details by its ID. This route allows updating specific fields and is restricted to users with the "admin" role.
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Laptop"
 *                 description: The updated name of the product
 *               description:
 *                 type: string
 *                 example: "Updated high performance laptop"
 *                 description: The updated description of the product
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 899.99
 *                 description: The updated price of the product
 *               stock:
 *                 type: integer
 *                 example: 5
 *                 description: The updated stock quantity
 *               category:
 *                 type: string
 *                 example: "Electronics"
 *                 description: The updated category of the product
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: URLs of the updated product images
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product Updated Successfully"
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The product ID
 *                     name:
 *                       type: string
 *                       description: The updated name of the product
 *                     description:
 *                       type: string
 *                       description: The updated description of the product
 *                     price:
 *                       type: number
 *                       format: float
 *                       description: The updated price of the product
 *                     stock:
 *                       type: integer
 *                       description: The updated stock quantity
 *                     category:
 *                       type: string
 *                       description: The updated category of the product
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                         description: URLs of the updated product images
 *       400:
 *         description: Bad request - Invalid input data
 *       404:
 *         description: Product not found - No product with the specified ID exists
 *       403:
 *         description: Forbidden - Only admin can access this route
 */

router
  .route('/:id')
  .get(authorize(['admin', 'user']), getProductById)
  .put(authorize(['admin']), putUpdateProduct)
  .patch(authorize(['admin']), patchUpdateProduct);

module.exports = router;
