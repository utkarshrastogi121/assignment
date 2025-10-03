import winston from "winston";
import path from "path";
const { combine, timestamp, printf, colorize } = winston.format;
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});
const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), logFormat),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), logFormat),
    }),
    new winston.transports.File({
      filename: path.join("logs", "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join("logs", "combined.log"),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join("logs", "exceptions.log"),
    }),
  ],
});
export default logger;
