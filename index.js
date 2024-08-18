import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv'

import * as userController from './controllers/userController.js'
import * as noteController from './controllers/noteController.js'
import { authenticateToken } from './middleware/auth.js'

dotenv.config()

const port = process.env.APP_PORT

// Defining the Express app
const app = express();

// Enabling CORS for all requests
app.use(cors());

// Use express JSON format
app.use(express.json({
    limit: '50mb'
}));

//====================== ROUTER

// Declaring sample endpoint
app.get('/', (req, res) => {
    res.send('--- Cypress Demo API ---');
});

app.post('/user/register', userController.register)
app.post('/user/login', userController.login)

app.get('/note', authenticateToken, noteController.getList)
app.post('/note', authenticateToken, noteController.create)
app.delete('/note/:id', authenticateToken, noteController.destroy)

// Catch-all for undefined routes
// this must be placed under all the routes that have been defined
app.use('*', (req, res) => {
    res.status(404).send({ status: 'error', message: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(500).send({ status: 'error', message: 'Internal Server Error' });
});

//====================== END ROUTER

app.listen(port, () => {
    console.log(`app listening on port http://localhost:${port}`)
})

export default app;