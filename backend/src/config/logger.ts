import fs from "fs";
import path from "path";
import { createLogger, format, transports } from "winston";
import morgan from "morgan";
import { NextFunction, Request, Response } from "express";
import DailyRotateFile from "winston-daily-rotate-file";

// Configuración de logs
const logDir = path.join(__dirname, "logs");
const allLogsPath = path.join(logDir, "all-logs.txt");
const errorLogsPath = path.join(logDir, "error-logs.txt");

// Crear directorio de logs si no existe
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const { combine, timestamp, printf, colorize, json } = format;

// Formato personalizado para logs
const customFormat = printf(({ level, message, timestamp, ...metadata }) => {
  return `${timestamp} [${level}] ${message} ${
    Object.keys(metadata).length ? JSON.stringify(metadata) : ""
  }`;
});

// Logger principal
export const logger = createLogger({
  level: "debug",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    json(),
    colorize()
  ),
  transports: [
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
    new DailyRotateFile({
      filename: "logs/application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
    }),
    new transports.Console({
      format: combine(colorize(), customFormat),
    }),
  ],
});

// Middleware de Morgan para HTTP logging
export const httpLogger = morgan(
  (tokens, req: Request, res: Response) => {
    const logData = {
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: tokens.status(req, res),
      responseTime: tokens["response-time"](req, res) + "ms",
      userAgent: tokens["user-agent"](req, res),
    };

    logger.info("HTTP Request", logData);
    return null;
  },
  {
    stream: {
      write: (message: string) => logger.http(message.trim()),
    },
  }
);

// Logger para Prisma
export const prismaLogger = {
  log: (level: string, message: string) =>
    logger.log(level, `[Prisma] ${message}`),
  warn: (message: string) => logger.warn(`[Prisma] ${message}`),
  error: (message: string) => logger.error(`[Prisma] ${message}`),
};

// Función para escribir en los archivos de log
export const logToFile = async (level: string, message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  const logEntry =
    JSON.stringify({
      timestamp,
      level,
      message,
      data: data || {},
    }) + "\n";

  try {
    // Escribir en all-logs.txt siempre
    await fs.promises.appendFile(allLogsPath, logEntry);

    // Escribir en error-logs.txt solo para errores
    if (level === "ERROR") {
      await fs.promises.appendFile(errorLogsPath, logEntry);
    }
  } catch (error) {
    console.error("Error escribiendo en log:", error);
  }
};

// Middleware para loggear peticiones
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    };

    // Escribir en consola
    console.log(
      `${new Date().toISOString()} - ${req.method} ${req.originalUrl} ${
        res.statusCode
      } ${duration}ms`
    );

    // Escribir en archivo
    const level = res.statusCode >= 400 ? "ERROR" : "INFO";
    logToFile(level, "Request", logData);
  });

  next();
};
