import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { createApp } from './app.js';

async function main() {
  await connectDatabase();

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`
    ╔══════════════════════════════════════════╗
    ║   OldPickleball API                      ║
    ║   Running on http://localhost:${env.PORT}      ║
    ║   Environment: ${env.NODE_ENV.padEnd(24)}║
    ╚══════════════════════════════════════════╝
    `);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
