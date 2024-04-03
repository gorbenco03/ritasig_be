
const mongoose = require('mongoose');

// Înlocuiește <password>, <dbname> și orice alte detalii necesare în URI

const uri = "mongodb+srv://chirilgorbenco:gorbenco03@gorbenco.ipxxjso.mongodb.net/?retryWrites=true&w=majority&appName=Gorbenco";

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('Error connecting to MongoDB Atlas', err);
    process.exit(1);
  }
};

module.exports = connectDB;

