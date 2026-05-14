const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const path = require('path');

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images FIRST
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to DB
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/orders', require('./routes/order.routes'));

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
