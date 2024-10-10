require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const mongoConnect = require('./db')
const services = require('./controllers/service')
const cron = require('node-cron');
const router = require('./routes/route')

app.use('/api',router)

app.get('/', (req, res) => {
    return res.status(200).json({
        message: "Backend is Live 🎉🎉🎉"
    })
})

mongoConnect(process.env.MONGO_URL).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening at http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error(err.message);
    process.exit(1);
});

cron.schedule('0 */2 * * *', async () => {
    await services.fetchCryptoData();
});