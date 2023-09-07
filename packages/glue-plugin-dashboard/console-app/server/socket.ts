export default class Socket {
  #io;
  constructor(server: any) {
    this.#io = new Server(server, {
      cors: {
        origin: 'http://localhost:3000',
      },
    });
  }
  getCurrentObject() {
    return this.#io;
  }
}
