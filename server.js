require('dotenv').config();
const express = require('express');
const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/products', productRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Inventory Management System API',
        version: '1.0.0',
        endpoints: {
            products: '/api/products'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Något gick fel!',
        message: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint hittades inte'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server körs på http://localhost:${PORT}`);
    console.log(`API tillgängligt på http://localhost:${PORT}/api/products`);
});