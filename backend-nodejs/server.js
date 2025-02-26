const express = require('express');
const axios = require('axios');

const app = express();
const port = 5000;
const MOCK_BASE_URL = 'http://localhost:3001';

app.get('/product/:id/similar', async (req, res) => {
    try {
        const { id = '' } = req.params;

        const { data: similarIds = [] } = await axios.get(`${MOCK_BASE_URL}/product/${id}/similarids`);

        const productDetailsPromises = similarIds.map(similarId =>
            axios.get(`${MOCK_BASE_URL}/product/${similarId}`)
                .then(response => response.data)
                .catch(() => null)
        );

        const products = (await Promise.all(productDetailsPromises)).filter(Boolean);
        res.json(products);

    } catch (error) {
        if (error.response?.status === 404) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
