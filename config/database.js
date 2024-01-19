/* mongoose configuration*/
const mongoose = require('mongoose');

const {MONGODB_URI} = require('../keys/keys')
//database configuration

async function connectToDatabase() {
	
	try {
	  await mongoose.connect(MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	  });
	  console.log('Connected to MongoDB');
	  // You can perform additional operations here after successful connection
	} catch (error) {
	  console.error('Error connecting to MongoDB:', error.message);
	  // Handle the error or throw it to be caught by an outer try/catch block
	  throw error;
	}
  }
  
  // Call the async function to connect to the database
  connectToDatabase();
	
module.export = mongoose;