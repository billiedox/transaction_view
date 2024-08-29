const Transaction = require('../models/Transaction')
const {
  Mobula
} = require("mobula-sdk");
const mobula = new Mobula(process.env.MOBULA_API_KEY);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Retrieve a list of transactions
 *     responses:
 *       200:
 *         description: A list of transactions
 */

const getTransactions = async (req, res) => {
  const {
    address,
    chain,
    page = 1,
    limit = 10
  } = req.query;

  const query = {};

  // If an address is provided, check both receivedAddress and spentAddress fields
  if (address) {
    query.$or = [{
        receivedAddress: {
          $regex: address,
          $options: 'i'
        }
      }, // Case-insensitive partial match
      {
        spentAddress: {
          $regex: address,
          $options: 'i'
        }
      } // Case-insensitive partial match
    ];
  }

  // If a chain is provided, filter by the chain field
  if (chain) {
    query.chain = { $regex: new RegExp(chain, 'i') };
  }

  const skip = (page - 1) * limit;

  try {
    const transactions = await Transaction.find(query)
      .skip(skip)
      .limit(parseInt(limit));

    res.json(transactions);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch transactions'
    });
  }
};

// Function to fetch transactions from external API (only new transactions)
const fetchTransactionsFromAPI = async (lastTransactionDate) => {
  try {
    const response = await mobula.fetchWalletTransactions({
      wallet: "0x9c34729f5a5fc1d499f669379f9b7ea1de1cf31e",
      from: lastTransactionDate,
      order: 'desc',
    });

    // Extract and decode the buffer
    const responseData = response.rawResponse.data; // This is the Buffer
    const jsonString = responseData.toString('utf8'); // Convert buffer to string
    const jsonData = JSON.parse(jsonString); // Parse the string into JSON
    return jsonData;
  } catch (error) {
    console.error('Failed to fetch transactions from API', error);
    return [];
  }
};

// Function to save transactions to MongoDB (using bulk write for optimization)
const saveTransactionsToDB = async (transactions) => {
  try {
    if (transactions.length === 0) return;

    const bulkOps = transactions.map(transaction => ({
      updateOne: {
        filter: {
          id: transaction.hash
        },
        update: {
          $set: {
            id: transaction.hash,
            type: transaction.type,
            chain: transaction.blockchain,
            spentAddress: transaction.from,
            receivedAddress: transaction.to,
            spentAmount: transaction.type === 'buy' ? transaction.amount_usd : transaction.amount,
            spentCurrency: transaction.type === 'buy' ? 'USDC' : transaction.asset.symbol,
            receivedAmount: transaction.type === 'buy' ? transaction.amount : transaction.amount_usd,
            receivedCurrency: transaction.type === 'buy' ? transaction.asset.symbol : 'USDC',
            receivedIcon: transaction.type === 'buy' ? transaction.asset.logo : 'https://metacore.mobula.io/9b4a08fadc7e3bed84e2eb662e097221da46ce2fedfc77f9fa8c1b3fa0c6cded.png',
            spentIcon: transaction.type === 'buy' ? 'https://metacore.mobula.io/9b4a08fadc7e3bed84e2eb662e097221da46ce2fedfc77f9fa8c1b3fa0c6cded.png' : transaction.asset.logo,
            timestamp: transaction.timestamp // Ensure this field exists and is properly formatted
          }
        },
        upsert: true,
      }
    }));

    await Transaction.bulkWrite(bulkOps);
    console.log(`${transactions.length} transactions saved to DB`);
  } catch (error) {
    console.error('Failed to save transactions to DB', error);
  }
};

// Fetch and save transactions every 5 minutes (with optimizations)
const updateTransactions = async () => {
  try {
    // Get the timestamp of the latest transaction in the database
    const latestTransaction = await Transaction.findOne().sort({
      timestamp: -1
    });

    const lastTransactionDate = latestTransaction ? latestTransaction.timestamp : 0;

    // Fetch only new transactions
    const newTransactions = await fetchTransactionsFromAPI(lastTransactionDate);

    // Save new transactions to the database using bulk operations
    await saveTransactionsToDB(newTransactions.data);

  } catch (error) {
    console.error('Failed to update transactions', error);
  }
};

// Initial update and schedule subsequent updates every 5 minutes
updateTransactions();
setInterval(updateTransactions, 5 * 60 * 1000); // Update every 5 minutes

module.exports = {
  getTransactions
};