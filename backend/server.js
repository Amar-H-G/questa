const { createServer } = require('http');
const app = require('./src/app');
const connectDatabase = require('./src/database/connect');
const env = require('./src/config/env');

const server = createServer(app);

const start = async () => {
  await connectDatabase();

  server.listen(env.PORT, () => {
    console.log(`SurCodex API listening on port ${env.PORT}`);
  });
};

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection', reason);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});

start();
