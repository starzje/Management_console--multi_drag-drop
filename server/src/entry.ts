#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from './app';
import http from 'http';
import stoppable from 'stoppable';
import { createLogger } from './lib/logger';

 const debug = createLogger('server:server');
  
 /**
  * Get port from environment and store in Express.
  */
 const port = normalizePort(process.env.PORT || '3000');
 app.set('port', port);
 
 
 /**
  * How long should stoppable wait before it starts force-closing connections
  */
 const FORCE_STOP_TIMEOUT = 10000; // wait max 10 seconds - ovo mora biti kraće od `healthcheck.timeout` (=15sec)
 
 /**
  * Create HTTP server.
  */
 const server = stoppable( http.createServer(app), FORCE_STOP_TIMEOUT );
 
 /**
  * Listen on provided port, on all network interfaces.
  */
 
 server.listen(port);
 server.on('error', onError);
 server.on('listening', onListening);
 
 /**
  * Normalize a port into a number, string, or false.
  */
 
 function normalizePort(val:string) {
   const port = parseInt(val, 10);
 
   if (isNaN(port)) {
     // named pipe
     return val;
   }
 
   if (port >= 0) {
     // port number
     return port;
   }
 
   return false;
 }
 
 /**
  * Event listener for HTTP server "error" event.
  */
 
 function onError(error:any) {
   if (error.syscall !== 'listen') {
     throw error;
   }
 
   const bind = typeof port === 'string'
     ? 'Pipe ' + port
     : 'Port ' + port;
 
   // handle specific listen errors with friendly messages
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
 }
 
 /**
  * Event listener for HTTP server "listening" event.
  */
 
 function onListening() {
   const addr = server.address();
   const bind = typeof addr === 'string'
     ? 'pipe ' + addr
     : 'port ' + addr?.port;
   debug('Listening on ' + bind);
 }
 
 // quit on ctrl-c when running docker in terminal
 // (signal neće biti registriran ako je server pokrenuti via `npm` ili `nodemon` - mora biti pokrenuti izravno via Node)
 process.on('SIGINT', () => {
     console.info('Got SIGINT (aka ctrl-c in docker). Graceful shutdown ', new Date().toISOString());
     shutdown();
 });
 
 // quit properly on docker stop
 // (signal neće biti registriran ako je server pokrenuti via `npm` ili `nodemon` - mora biti pokrenuti izravno via Node)
 process.on('SIGTERM', () => {
     console.info('Got SIGTERM (docker container stop). Graceful shutdown ', new Date().toISOString());
     shutdown();
 })
 
 // shut down server
 const shutdown = () => {
   // NOTE: server.close is for express based apps
   // If using hapi, use `server.stop`
   server.close((err) => {
     if (err) {
       console.error(err);
       process.exitCode = 1;
     } else {
         console.info('Exiting server process...');
     }
     process.exit();
   });
 };
 