export const wrapConnectMiddlewareToSocket = (middleware) => (socket, next) => middleware(socket.request, {}, next);
