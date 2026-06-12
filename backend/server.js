const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const { errorHandler } = require('./src/middlewares/errorMiddleware');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes (Placeholder for now)
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/quizzes', require('./src/routes/quizRoutes'));


app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/health', (req, res) => {
    const mongoose = require('mongoose');
    res.status(200).json({
        status: 'UP',
        uptime: process.uptime(),
        timestamp: new Date(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
