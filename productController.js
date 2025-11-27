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

module.exports = {
    getAllProducts,
    getProductById
};