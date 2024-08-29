const express = require('express');
const { getTransactions } = require('../controllers/transactionControllers.js');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: The Transactions managing API
 */

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Retrieve a list of transactions
 *     tags: [Transactions]
 *     parameters:
 *       - name: address
 *         in: query
 *         description: The wallet address for searching
 *         required: false
 *         schema:
 *           type: string
 *           example: 0x9c34729f5a5fc1d499f669379f9b7ea1de1cf31e
 *       - name: chain
 *         in: query
 *         description: The chain name for searching
 *         required: false
 *         schema:
 *           type: string
 *           example: Ploygon
 *       - name: page
 *         in: query
 *         description: The page number for pagination
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 * 
 *     responses:
 *       200:
 *         description: A list of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *         - id
 *         - spentAmount
 *         - spentCurrency
 *         - spentIcon
 *         - spentAddress
 *         - receivedAmount
 *         - receivedCurrency
 *         - receivedIcon
 *         - receivedAddress
 *       properties:
 *         id:
 *           type: string
 *           description: The transaction ID
 *         spentAmount:
 *           type: number
 *           description: The amount spent
 *         spentCurrency:
 *           type: string
 *           description: The currency spent
 *         spentIcon:
 *           type: string
 *           description: The spent coin's logo
 *         spentAddress:
 *           type: string
 *           description: The spent wallet address
 *         receivedAmount:
 *           type: number
 *           description: The amount received
 *         receivedCurrency:
 *           type: string
 *           description: The currency received
 *         receivedIcon:
 *           type: string
 *           description: The received coin's logo
 *         receivedAddress:
 *           type: string
 *           description: The received wallet address
 */

router.get('/', getTransactions);

module.exports = router;
