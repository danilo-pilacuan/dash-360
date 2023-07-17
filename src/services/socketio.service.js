
import { io } from 'socket.io-client';

//let socket = io("http://localhost:3000");

class SocketioService {
  
  constructor() {}

  setupSocketConnection() {
    this.socket = io(process.env.VUE_APP_API+":3000");
  }
}

export default new SocketioService();