export const initErrorHandling = () => {
  process.on('uncaughtException', (err) => {
    process.exit(1);
  });

  process.on('unhandledRejection', () => {
    process.exit(1);
  });
};

export const initAppErrorHandling = (app: Express) => {};
