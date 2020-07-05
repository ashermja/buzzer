import mongoose from 'mongoose';
import 'dotenv/config.js';

export let connection;
let connectCnt = 0;
let connected = false;

export const connect = () => {
  connectCnt += 1;
  if (connection) return connection;

  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      promiseLibrary: Promise,
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
    };
    connection = mongoose.createConnection();

    connection.openUri(process.env.MONGODB_URI, undefined, undefined, options);
  } catch (e) {
    console.log(e);
  }
  connection.on('error', (error) => {
    connected = false;
  });
  connection.on('open', () => {
    connected = true;
  });
  return connection;
};

export const isConnected = () => {
  return connected;
  // return mongoose.connection.readyState === 1;
};

export const close = () => {
  connected = false;
  mongoose.connection.close();
};
