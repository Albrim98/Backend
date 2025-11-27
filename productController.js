const pool = require('../config/database');

// Hämta alla produkter
const getAllProducts = async (req, res) => {
    try {
        console.log('Försöker hämta produkter från databasen...');
        const result = await pool.query(
            'SELECT * FROM products ORDER BY id ASC'
        );
        console.log('Produkter hämtade:', result.rows.length);

        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        console.error('Fel vid hämtning av produkter:', error);
        console.error('Detaljerat fel:', error.message);
        console.error('Felkod:', error.code);
        res.status(500).json({
            success: false,
            error: 'Kunde inte hämta produkter',
            details: error.message
        });
    }
};

// Hämta en specifik produkt
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM products WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Produkten hittades inte'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Fel vid hämtning av produkt:', error);
        res.status(500).json({
            success: false,
            error: 'Kunde inte hämta produkten'
        });
    }
};

// Skapa ny produkt
const createProduct = async (req, res) => {
    try {
        const { name, quantity, price, category } = req.body;

        if (!name || quantity === undefined || !price || !category) {
            return res.status(400).json({
                success: false,
                error: 'Alla fält (name, quantity, price, category) måste anges'
            });
        }

        if (quantity < 0) {
            return res.status(400).json({
                success: false,
                error: 'Antal kan inte vara negativt'
            });
        }

        if (price <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Pris måste vara större än 0'
            });
        }

        const result = await pool.query(
            'INSERT INTO products (name, quantity, price, category) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, quantity, price, category]
        );

        res.status(201).json({
            success: true,
            message: 'Produkten skapades',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Fel vid skapande av produkt:', error);
        res.status(500).json({
            success: false,
            error: 'Kunde inte skapa produkten'
        });
    }
};

// Uppdatera produkt
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, quantity, price, category } = req.body;

        const checkProduct = await pool.query(
            'SELECT * FROM products WHERE id = $1',
            [id]
        );

        if (checkProduct.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Produkten hittades inte'
            });
        }

        if (quantity !== undefined && quantity < 0) {
            return res.status(400).json({
                success: false,
                error: 'Antal kan inte vara negativt'
            });
        }

        if (price !== undefined && price <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Pris måste vara större än 0'
            });
        }

        // Använd befintliga värden om nya inte anges
        const existingProduct = checkProduct.rows[0];
        const updatedName = name !== undefined ? name : existingProduct.name;
        const updatedQuantity = quantity !== undefined ? quantity : existingProduct.quantity;
        const updatedPrice = price !== undefined ? price : existingProduct.price;
        const updatedCategory = category !== undefined ? category : existingProduct.category;

        const result = await pool.query(
            'UPDATE products SET name = $1, quantity = $2, price = $3, category = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
            [updatedName, updatedQuantity, updatedPrice, updatedCategory, id]
        );

        res.json({
            success: true,
            message: 'Produkten uppdaterades',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Fel vid uppdatering av produkt:', error);
        res.status(500).json({
            success: false,
            error: 'Kunde inte uppdatera produkten'
        });
    }
};

// Ta bort produkt
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM products WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Produkten hittades inte'
            });
        }

        res.json({
            success: true,
            message: 'Produkten togs bort',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Fel vid borttagning av produkt:', error);
        res.status(500).json({
            success: false,
            error: 'Kunde inte ta bort produkten'
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};