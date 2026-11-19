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
    // ok handling the case where the database connection fails. In this case, we log the error message and start the server in offline/no-database mode. This allows the application to still run and serve requests, even if it cannot connect to the database. The server will be running on the specified port, and a message will be logged to indicate that it is running in offline mode.
    .catch((err) => {
        console.error('Database connection failed:', err.message || err);
        app.listen(port, () => {
            console.log(`Server started on http://localhost:${port} (Running in offline/no-database mode)`);
        });
    });