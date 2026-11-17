const express = require('express');
const app = express();

app.use(express.json());


// In-memory data
let products = [
    { id: 301, name: "Wireless Mouse", category: "Electronics", price: 799, quantity: 25, inStock: true },
    { id: 302, name: "Notebook", category: "Stationery", price: 60, quantity: 100, inStock: true },
    { id: 303, name: "USB Keyboard", category: "Electronics", price: 999, quantity: 0, inStock: false }
];

// GET all products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// GET filter by category (must be before :id)
app.get('/api/products/filter', (req, res) => {
    const category = req.query.category;
    if (!category) return res.status(400).json({ error: "Category is required" });
    
    const result = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    res.json(result);
});

// GET product by ID
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
});

// POST new product
app.post('/api/products', (req, res) => {
    const { name, category, price, quantity, inStock } = req.body;
    
    if (!name || !category || typeof price !== 'number' || typeof quantity !== 'number' || typeof inStock !== 'boolean') {
        return res.status(400).json({ error: "Invalid input" });
    }

    const newProduct = {
        id: products.length > 0 ? products[products.length - 1].id + 1 : 301,
        name, category, price, quantity, inStock
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

// PUT update product
app.put('/api/products/:id', (req, res) => {
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Not found" });

    const { name, category, price, quantity, inStock } = req.body;
    const p = products[index];

    products[index] = {
        id: p.id,
        name: name !== undefined ? name : p.name,
        category: category !== undefined ? category : p.category,
        price: price !== undefined ? price : p.price,
        quantity: quantity !== undefined ? quantity : p.quantity,
        inStock: inStock !== undefined ? inStock : p.inStock
    };

    res.json(products[index]);
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Not found" });

    products.splice(index, 1);
    res.json({ message: "Deleted successfully" });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

