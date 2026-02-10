import app from './src/app.js';
import { env } from './src/config/env.js';
import { pool } from './src/config/db.js';

const PORT = env.PORT;

pool
  .query('SELECT 1')
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });
