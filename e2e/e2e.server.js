import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { fileURLToPath } from 'url';
import path from 'path';
import config from '../webpack.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = new WebpackDevServer(webpack(config), {});
server.listen(9000, 'localhost', (err) => {
  if (err) {
    console.error(err);
    return;
  }
  if (process.send) {
    process.send('ok');
  }
});
