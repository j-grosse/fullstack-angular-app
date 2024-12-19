import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import { join as pathJoin } from 'path';

import { connectToMongo } from './mongo';
import setRoutes from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

// app.set('port', (process.env.PORT || 3000));
app.use('/', express.static(pathJoin(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

setRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Connect to MongoDB after server starts
const initMongo = async (): Promise<void> => {
  try {
    await connectToMongo();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

if (process.env.NODE_ENV !== 'test') {
  initMongo();
}

// Catch-all route for Angular
app.get('/*', (req, res) => {
  res.sendFile(pathJoin(__dirname, '../public/browser/index.html'));
});

export { app };
