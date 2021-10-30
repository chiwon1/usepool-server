import app from '../app';
import debug from 'debug';
import http from 'http';
import webSocket from '../socket';

const normalizePort = (val: string) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
};

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);

const onError = (error: { syscall: string; code: string }) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind =
    typeof port === 'string' ? `Pipe ${port}` : `Port ${port as number}`;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

server.listen(port);
server.on('error', onError);

webSocket(server, app);

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `pipe ${addr!.port}`;
  debug('usepool-server:server')('Listening on ' + bind);
};

server.on('listening', onListening);
