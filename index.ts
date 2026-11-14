import app from './src/app';
import config from './src/config';

const PORT = config.port;

console.log(`Server running at http://0.0.0.0:${PORT}`);

export default {
  port: PORT,
  hostname: '0.0.0.0',
  fetch: app.fetch,
};
