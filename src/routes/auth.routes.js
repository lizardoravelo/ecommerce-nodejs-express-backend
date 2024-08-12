const { Router } = require('express');
const router = Router();
const authorize = require('../middleware/authorization');
const {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require('../controller/auth.controller');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user in the system with the provided details. The user role can be either "user" or "admin". If successful, the new user is registered and their information is saved in the database.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user
 *               email:
 *                 type: string
 *                 description: The email address of the user
 *               password:
 *                 type: string
 *                 description: The password for the user account
 *               address:
 *                 type: string
 *                 description: The address of the user (optional)
 *               phone:
 *                 type: string
 *                 description: The phone number of the user (optional)
 *               role:
 *                 type: string
 *                 description: The role of the user
 *                 enum: [user, admin]
 *             example: {
 *               "name": "John Doe",
 *               "email": "johndoe@example.com",
 *               "password": "securePassword123",
 *               "address": "123 Main St, Anytown, USA",
 *               "phone": "+1234567890",
 *               "role": "user"
 *             }
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request - Invalid input or user already exists
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticates a user with their email and password. On successful login, a JWT token is returned, which can be used for subsequent requests that require authentication.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user
 *               password:
 *                 type: string
 *                 description: The password for the user account
 *             example: {
 *               "email": "johndoe@example.com",
 *               "password": "securePassword123"
 *             }
 *     responses:
 *       200:
 *         description: User logged in successfully - JWT token provided
 *       401:
 *         description: Unauthorized - Invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Get all users - Only admin can access this route
 *     description: Retrieves a list of all users in the system. This route is restricted to users with the "admin" role. The response includes user details such as id, name, email, address, phone, role, and active status.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The user ID
 *                   name:
 *                     type: string
 *                     description: The name of the user
 *                   email:
 *                     type: string
 *                     description: The email address of the user
 *                   address:
 *                     type: string
 *                     description: The address of the user
 *                   phone:
 *                     type: string
 *                     description: The phone number of the user
 *                   role:
 *                     type: string
 *                     description: The role of the user (user or admin)
 *                   active:
 *                     type: boolean
 *                     description: Indicates whether the user account is active
 *       403:
 *         description: Forbidden - Only admin can access this route
 */
router.route('/users').get(authorize(['admin']), getAllUsers);

/**
 * @swagger
 * /auth/users/{id}:
 *   get:
 *     summary: Get user by ID - Only logged users can access this route
 *     description: Retrieves detailed information for a specific user by their ID. This route is accessible to both "admin" and "user" roles, but only admins can access details of other users.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: The user ID
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The user ID
 *                 name:
 *                   type: string
 *                   description: The name of the user
 *                 email:
 *                   type: string
 *                   description: The email address of the user
 *                 address:
 *                   type: string
 *                   description: The address of the user
 *                 phone:
 *                   type: string
 *                   description: The phone number of the user
 *                 role:
 *                   type: string
 *                   description: The role of the user (user or admin)
 *                 active:
 *                   type: boolean
 *                   description: Indicates whether the user account is active
 *       403:
 *         description: Forbidden - Only logged users can access this route
 *   put:
 *     summary: Update user by ID - Only logged users can access this route
 *     description: Updates the details of a specific user by their ID. Users can update their own details, while admins can update details for any user.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user
 *               email:
 *                 type: string
 *                 description: The email address of the user
 *               password:
 *                 type: string
 *                 description: The password for the user account
 *               address:
 *                 type: string
 *                 description: The address of the user
 *               phone:
 *                 type: string
 *                 description: The phone number of the user
 *               role:
 *                 type: string
 *                 description: The role of the user
 *                 enum: [user, admin]
 *               active:
 *                 type: boolean
 *                 description: Indicates whether the user account is active
 *             example: {
 *               "name": "Jane Doe",
 *               "email": "janedoe@example.com",
 *               "password": "newSecurePassword123",
 *               "address": "456 Elm St, Anytown, USA",
 *               "phone": "+1234567890",
 *               "role": "user",
 *               "active": true
 *             }
 *     responses:
 *       200:
 *         description: User updated successfully
 *       403:
 *         description: Forbidden - Only logged users can access this route
 *   delete:
 *     summary: Delete user by ID - Only admin can access this route
 *     description: Deletes a user from the system by their ID. This action is restricted to users with the "admin" role.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Forbidden - Only admin can access this route
 */
router
  .route('/users/:id')
  .get(authorize(['admin', 'user']), getUserById)
  .put(authorize(['admin', 'user']), updateUserById)
  .delete(authorize(['admin']), deleteUserById);

module.exports = router;
