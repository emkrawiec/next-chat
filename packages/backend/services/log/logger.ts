import winston from 'winston';

const alignColorsAndTime = winston.format.combine(
  winston.format(info => {
    info.level = info.level.toUpperCase()
    return info;
  })(),
  winston.format.colorize({
      all: true
  }),
  winston.format.timestamp({
      format:"DD-MM-YYYY HH:mm:SS"
  }),
  winston.format.printf(
      info => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

export const logger = winston.createLogger({
  level: 'debug',
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: alignColorsAndTime,
  }));
} else {
  logger.add(new winston.transports.File({
    filename: 'debug.log',
  }))
}
