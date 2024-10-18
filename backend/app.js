// import express from "express";
// import dotenv from 'dotenv';
// import conn from './conn/conn.js';
// import auth from './routes/auth.routes.js'
// import list from './routes/list.routes.js'
// import cors from 'cors'

// dotenv.config();

// conn();

// const app = express();
// app.use(cors());
// app.use(express.json())
// app.use("/api/v1",auth);
// app.use("/api/v2",list);

// const PORT = process.env.PORT;
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
import express from "express";
import dotenv from 'dotenv';
import conn from './conn/conn.js';
import auth from './routes/auth.routes.js';
import list from './routes/list.routes.js';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Initialize the database connection
conn();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1", auth);
app.use("/api/v2", list);

// Define the port, fallback to 3001 if process.env.PORT is not set
const PORT = process.env.PORT || 3001;

// Start the server and handle the EADDRINUSE error
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please choose another port.`);
        process.exit(1); // Exit the process with failure
    } else {
        console.error(`Error occurred: ${err.message}`);
    }
});
