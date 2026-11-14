const app = require('./src/app')
const connectDB = require('./src/config/db')

const port = process.env.PORT || 8000;

connectDB()
    .then(() => {
        console.log('Database Connected');
        app.listen(port, () => {
            console.log(`Server started on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Database connection failed:', err.message || err);
        app.listen(port, () => {
            console.log(`Server started on http://localhost:${port} (Running in offline/no-database mode)`);
        });
    });