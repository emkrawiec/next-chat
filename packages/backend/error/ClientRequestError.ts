export class ClientRequestError extends Error {
  constructor() {
    super();
    this.message = 'There was a problem with client request!';
  }
}