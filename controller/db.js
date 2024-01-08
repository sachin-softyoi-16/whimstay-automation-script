const { MongoClient } = require('mongodb');

const url = process.env.MONGO_DB_URL;

async function connectToDatabase() {
    const client = new MongoClient(url);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db(); // Return the MongoDB database
    } catch (error) {
        console.error('Database connection error:', error);
    }
}

module.exports = {
    connectToDatabase,
};
