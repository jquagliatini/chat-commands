import { resolve, join } from 'path'
import dotenv from './utils/dotenv';
dotenv(resolve(join(__dirname, '..', '.env')));

const http = require('http').createServer();
const io = require('socket.io')(http);

import SocketController from './controllers/SocketController';

SocketController(io);

http.listen(parseInt(process.env.APP_PORT), () => {
   console.log(`server listens on :${process.env.APP_PORT}...`);
});
